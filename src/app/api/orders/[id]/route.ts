import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { OrderStatus, PaymentStatus } from "@/types";
import { sendOrderConfirmedEmail } from "@/lib/email";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "preparing", "ready",
  "out_for_delivery", "completed", "cancelled",
];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "verified", "rejected"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json() as Record<string, unknown>;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.order_status !== undefined) {
      if (!VALID_ORDER_STATUSES.includes(body.order_status as OrderStatus)) {
        return NextResponse.json({ success: false, error: "Invalid order status." }, { status: 400 });
      }
      updates.order_status = body.order_status;
    }

    if (body.payment_status !== undefined) {
      if (!VALID_PAYMENT_STATUSES.includes(body.payment_status as PaymentStatus)) {
        return NextResponse.json({ success: false, error: "Invalid payment status." }, { status: 400 });
      }
      updates.payment_status = body.payment_status;
    }

    if (body.payment_rejection_reason !== undefined) {
      updates.payment_rejection_reason =
        typeof body.payment_rejection_reason === "string"
          ? body.payment_rejection_reason.slice(0, 500)
          : null;
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to update order." }, { status: 500 });
    }

    // Fire customer confirmation email when order is set to "confirmed"
    if (updates.order_status === "confirmed") {
      const { data: fullOrder } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();

      if (fullOrder) {
        sendOrderConfirmedEmail({
          orderNumber: fullOrder.order_number,
          customerName: fullOrder.customer_name,
          customerEmail: fullOrder.email,
          orderType: fullOrder.order_type,
          deliveryLocation: fullOrder.delivery_location,
          items: fullOrder.order_items,
          subtotal: fullOrder.subtotal,
          takeawayFee: fullOrder.takeaway_fee,
          deliveryFee: fullOrder.delivery_fee,
          total: fullOrder.total,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[orders PATCH]", err);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
