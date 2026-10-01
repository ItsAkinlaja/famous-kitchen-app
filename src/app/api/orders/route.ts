import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/settings";
import { CreateOrderPayload } from "@/types";
import { sendNewOrderNotification, sendOrderPlacedEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

function isValidNigerianPhone(phone: string): boolean {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function validatePayload(body: unknown): { valid: boolean; error?: string; data?: CreateOrderPayload } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const b = body as Record<string, unknown>;

  if (!b.customerName || typeof b.customerName !== "string" || b.customerName.trim().length < 2) {
    return { valid: false, error: "Please provide a valid full name." };
  }
  if (!b.phone || typeof b.phone !== "string" || !isValidNigerianPhone(b.phone)) {
    return { valid: false, error: "Please provide a valid Nigerian phone number." };
  }
  if (!b.email || typeof b.email !== "string" || !isValidEmail(b.email)) {
    return { valid: false, error: "Please provide a valid email address." };
  }
  if (!b.stateCode || typeof b.stateCode !== "string" || b.stateCode.trim().length < 2) {
    return { valid: false, error: "Please provide your NYSC state code." };
  }
  if (b.orderType !== "pickup" && b.orderType !== "delivery") {
    return { valid: false, error: "Invalid order type." };
  }
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { valid: false, error: "Your cart is empty." };
  }
  if (b.items.length > 20) {
    return { valid: false, error: "Too many items in order." };
  }
  for (const item of b.items as unknown[]) {
    if (!item || typeof item !== "object") return { valid: false, error: "Invalid item data." };
    const i = item as Record<string, unknown>;
    if (!i.menuItemId || typeof i.menuItemId !== "string" || !isValidUUID(i.menuItemId)) {
      return { valid: false, error: "Invalid menu item." };
    }
    if (typeof i.quantity !== "number" || i.quantity < 1 || i.quantity > 50 || !Number.isInteger(i.quantity)) {
      return { valid: false, error: "Invalid item quantity." };
    }
  }
  if (!b.receiptUrl || typeof b.receiptUrl !== "string" || !b.receiptUrl.startsWith("https://ik.imagekit.io/")) {
    return { valid: false, error: "Invalid receipt. Please upload your payment screenshot." };
  }

  return {
    valid: true,
    data: {
      customerName: (b.customerName as string).trim(),
      phone: b.phone as string,
      email: b.email as string,
      stateCode: (b.stateCode as string).trim().toUpperCase(),
      orderType: b.orderType as "pickup" | "delivery",
      deliveryLocation: typeof b.deliveryLocation === "string" ? b.deliveryLocation : "",
      orderNote: typeof b.orderNote === "string" ? b.orderNote.slice(0, 500) : undefined,
      items: b.items as { menuItemId: string; quantity: number }[],
      receiptUrl: b.receiptUrl as string,
    },
  };
}

function generateOrderNumber(sequenceNum: number): string {
  // Add random suffix to avoid race condition when multiple orders arrive simultaneously
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `FK-${String(sequenceNum).padStart(4, "0")}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 5 orders per IP per 15 minutes
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(`orders:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        { success: false, error: "Too many orders submitted. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { valid, error: validationError, data } = validatePayload(body);

    if (!valid || !data) {
      return NextResponse.json(
        { success: false, error: validationError || "Invalid order data." },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // 1. Retrieve settings for fees
    const { data: settingsRows } = await supabase.from("settings").select("*");
    const settings = parseSettings(settingsRows ?? []);

    // 2. Retrieve and validate menu items — server-side pricing, never trust client
    const menuItemIds = data.items.map((i) => i.menuItemId);
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name, price, is_available")
      .in("id", menuItemIds);

    if (menuError || !menuItems) {
      return NextResponse.json(
        { success: false, error: "Failed to retrieve menu items." },
        { status: 500 }
      );
    }

    // 3. Verify all items exist and are available
    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

    for (const item of data.items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { success: false, error: "One or more menu items were not found." },
          { status: 400 }
        );
      }
      if (!menuItem.is_available) {
        return NextResponse.json(
          { success: false, error: `"${menuItem.name}" is currently unavailable. Please remove it from your order.` },
          { status: 400 }
        );
      }
    }

    // 4. Calculate totals server-side — never trust client prices
    let subtotal = 0;
    const orderItemsData = data.items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId)!;
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        menu_item_id: item.menuItemId,
        item_name: menuItem.name,
        unit_price: menuItem.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const takeawayFee = data.orderType === "delivery" ? settings.takeawayFee : 0;
    const deliveryFee = data.orderType === "delivery" ? settings.deliveryFee : 0;
    const total = subtotal + takeawayFee + deliveryFee;

    // 5. Generate unique order number
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const sequenceNum = (count ?? 0) + 1001;
    const orderNumber = generateOrderNumber(sequenceNum);

    // 6. Create order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email,
        state_code: data.stateCode,
        order_type: data.orderType,
        delivery_location: data.deliveryLocation || null,
        delivery_note: data.orderNote || null,
        subtotal,
        takeaway_fee: takeawayFee,
        delivery_fee: deliveryFee,
        total,
        payment_status: "pending",
        order_status: "pending",
        receipt_url: data.receiptUrl,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      console.error("[orders POST] order insert:", orderError);
      return NextResponse.json(
        { success: false, error: "Failed to create order. Please try again." },
        { status: 500 }
      );
    }

    // 7. Create order items
    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItemsData.map((item) => ({ order_id: order.id, ...item }))
    );

    if (itemsError) {
      console.error("[orders POST] order items insert:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { success: false, error: "Failed to save order items. Please try again." },
        { status: 500 }
      );
    }

    // 8. Send admin email notification (fire-and-forget)
    sendNewOrderNotification({
      orderNumber: order.order_number,
      orderId: order.id,
      customerName: data.customerName,
      customerEmail: data.email,
      customerPhone: data.phone,
      stateCode: data.stateCode,
      orderType: data.orderType,
      deliveryLocation: data.deliveryLocation || null,
      orderNote: data.orderNote || null,
      items: orderItemsData,
      subtotal,
      takeawayFee,
      deliveryFee,
      total,
      receiptUrl: data.receiptUrl,
      adminEmail: process.env.ADMIN_EMAIL ?? settings.email,
    });

    // 9. Send buyer order placed email (fire-and-forget)
    sendOrderPlacedEmail({
      orderNumber: order.order_number,
      customerName: data.customerName,
      customerEmail: data.email,
      orderType: data.orderType,
      deliveryLocation: data.deliveryLocation || null,
      items: orderItemsData,
      subtotal,
      takeawayFee,
      deliveryFee,
      total,
    });

    return NextResponse.json({
      success: true,
      data: { orderNumber: order.order_number, orderId: order.id },
    });
  } catch (err) {
    console.error("[orders POST]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
