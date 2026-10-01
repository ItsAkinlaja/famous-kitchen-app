import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Returns only safe, non-PII fields needed for the confirmation page.
// Full order details (customer name, phone, email) are NOT returned to avoid
// exposing PII to anyone who finds the URL.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid order ID." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        order_type,
        delivery_location,
        delivery_note,
        subtotal,
        takeaway_fee,
        delivery_fee,
        total,
        payment_status,
        order_status,
        created_at,
        order_items (
          id,
          item_name,
          unit_price,
          quantity,
          subtotal
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[orders/confirmation]", err);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
