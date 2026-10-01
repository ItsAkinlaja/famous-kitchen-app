"use client";

import { useState } from "react";
import Image from "next/image";
import { OrderWithItems, OrderStatus, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { PaymentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { X } from "lucide-react";

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface AdminOrderModalProps {
  order: OrderWithItems;
  onClose: () => void;
  onUpdate: (orderId: string, updates: Partial<OrderWithItems>) => void;
}

export function AdminOrderModal({ order, onClose, onUpdate }: AdminOrderModalProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.order_status);
  const [rejectionReason, setRejectionReason] = useState(order.payment_rejection_reason ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  async function updateOrderStatus() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: orderStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update.");
      onUpdate(order.id, { order_status: orderStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function verifyPayment() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "verified" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to verify.");
      onUpdate(order.id, { payment_status: "verified" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setSaving(false);
    }
  }

  async function rejectPayment() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: "rejected",
          payment_rejection_reason: rejectionReason || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to reject.");
      onUpdate(order.id, {
        payment_status: "rejected",
        payment_rejection_reason: rejectionReason || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.order_number} details`}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white sm:max-w-lg sm:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="font-semibold text-stone-900">#{order.order_number}</p>
            <p className="text-xs text-stone-400">
              {new Date(order.created_at).toLocaleString("en-NG")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-stone-400 hover:bg-stone-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Customer */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Customer</p>
            <p className="mt-1 font-medium text-stone-900">{order.customer_name}</p>
            {order.state_code && (
              <p className="text-xs font-semibold text-[#FC0003] mt-0.5">{order.state_code}</p>
            )}
            <a href={`tel:${order.phone}`} className="text-sm text-stone-600 hover:text-stone-900">{order.phone}</a>
            <p className="text-sm text-stone-600">{order.email}</p>
          </section>

          {/* Delivery */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Delivery</p>
            <p className="mt-1 text-sm text-stone-700 capitalize">{order.order_type}</p>
            {order.delivery_location && (
              <p className="text-sm text-stone-600">{order.delivery_location}</p>
            )}
            {order.delivery_note && (
              <p className="text-xs text-stone-400">Note: {order.delivery_note}</p>
            )}
          </section>

          {/* Items */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Items</p>
            <ul className="mt-1 space-y-1">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-700">
                    {item.item_name} ×{item.quantity}
                  </span>
                  <span className="text-stone-900 font-medium">
                    {formatCurrency(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-stone-100 pt-2 text-sm font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </section>

          {/* Status badges */}
          <section className="flex flex-wrap gap-2">
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.order_status} />
          </section>

          {/* Receipt */}
          {order.receipt_url && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Payment receipt
              </p>
              <button
                onClick={() => setShowReceipt((v) => !v)}
                className="mt-1 text-sm text-stone-700 underline hover:text-stone-900"
              >
                {showReceipt ? "Hide receipt" : "View receipt"}
              </button>
              {showReceipt && (
                <div className="mt-2 relative h-64 w-full overflow-hidden rounded border border-stone-200 bg-stone-100">
                  <Image
                    src={order.receipt_url}
                    alt="Payment receipt"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {order.payment_status === "pending" && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={verifyPayment}
                      loading={saving}
                    >
                      Verify payment
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={rejectPayment}
                      loading={saving}
                    >
                      Reject payment
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Rejection reason (optional)"
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </section>
          )}

          {/* Update order status */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Update order status
            </p>
            <div className="mt-2 flex gap-2">
              <Select
                options={ORDER_STATUS_OPTIONS}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={updateOrderStatus}
                loading={saving}
                disabled={orderStatus === order.order_status}
              >
                Update
              </Button>
            </div>
          </section>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
