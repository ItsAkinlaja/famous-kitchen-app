"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderWithItems, AppSettings } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { PaymentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface OrderConfirmationContentProps {
  settings: AppSettings;
}

export function OrderConfirmationContent({ settings }: OrderConfirmationContentProps) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order not found.");
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/confirmation?id=${orderId}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Order not found.");
        setOrder(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load order.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  function buildWhatsAppMessage(o: OrderWithItems): string {
    const items = o.order_items
      .map((i) => `- ${i.item_name} x${i.quantity} (${formatCurrency(i.subtotal)})`)
      .join("\n");

    const deliveryLine =
      o.order_type === "delivery"
        ? `Delivery to: ${o.delivery_location}`
        : "Pickup";

    const message = [
      `Hello Famous Kitchen,`,
      ``,
      `Order #${o.order_number}`,
      ``,
      `Items:`,
      items,
      ``,
      `Subtotal: ${formatCurrency(o.subtotal)}`,
      o.takeaway_fee > 0 ? `Takeaway fee: ${formatCurrency(o.takeaway_fee)}` : null,
      o.delivery_fee > 0 ? `Delivery fee: ${formatCurrency(o.delivery_fee)}` : null,
      `Total: ${formatCurrency(o.total)}`,
      ``,
      deliveryLine,
      `Payment status: Awaiting verification`,
      ``,
      `Name: ${o.customer_name}`,
      `Phone: ${o.phone}`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return encodeURIComponent(message);
  }

  if (loading) {
    return <div className="text-sm text-stone-400 py-12 text-center">Loading your order…</div>;
  }

  if (error || !order) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-700 font-medium">Order not found</p>
        <p className="mt-1 text-sm text-stone-500">
          {error || "We could not load your order details."}
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    );
  }

  const waMessage = buildWhatsAppMessage(order);
  const waNumber = `234${settings.whatsapp.replace(/^0/, "")}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Confirmation header */}
      <div className="rounded border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Order received
        </p>
        <p className="mt-1 text-xl font-bold text-stone-900">
          #{order.order_number}
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Your order has been received and your payment is awaiting verification.
          We&apos;ll confirm your order once payment is verified.
        </p>
      </div>

      {/* Status */}
      <div className="flex gap-3 flex-wrap">
        <PaymentStatusBadge status={order.payment_status} />
        <OrderStatusBadge status={order.order_status} />
      </div>

      {/* Order items */}
      <div>
        <h2 className="text-sm font-semibold text-stone-700">Order items</h2>
        <ul className="mt-2 divide-y divide-stone-100 rounded border border-stone-200">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-stone-900">{item.item_name}</p>
                <p className="text-xs text-stone-500">
                  {formatCurrency(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <p className="font-medium text-stone-900">
                {formatCurrency(item.subtotal)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Totals */}
      <div className="rounded border border-stone-200 p-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.takeaway_fee > 0 && (
            <div className="flex justify-between text-sm text-stone-600">
              <span>Takeaway packaging</span>
              <span>{formatCurrency(order.takeaway_fee)}</span>
            </div>
          )}
          {order.delivery_fee > 0 && (
            <div className="flex justify-between text-sm text-stone-600">
              <span>Delivery fee</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="rounded border border-stone-200 p-4 text-sm">
        <p className="font-medium text-stone-700">
          {order.order_type === "pickup" ? "Pickup" : "Delivery"}
        </p>
        {order.delivery_location && (
          <p className="mt-0.5 text-stone-500">{order.delivery_location}</p>
        )}
        {order.delivery_note && (
          <p className="mt-1 text-stone-400 text-xs">Note: {order.delivery_note}</p>
        )}
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${waNumber}?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-50 transition-colors"
      >
        Send order on WhatsApp
      </a>

      <Link href="/menu">
        <Button variant="ghost" className="w-full text-stone-500">
          Back to menu
        </Button>
      </Link>
    </div>
  );
}
