"use client";

import { useState, useEffect } from "react";
import { OrderWithItems, OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { PaymentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { X, Phone, Mail, MapPin } from "lucide-react";

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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function updateOrderStatus() {
    setSaving(true); setError(null); setSuccessMsg(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: orderStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update.");
      onUpdate(order.id, { order_status: orderStatus });
      setSuccessMsg("Order status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setSaving(false); }
  }

  async function verifyPayment() {
    setSaving(true); setError(null); setSuccessMsg(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "verified" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to verify.");
      onUpdate(order.id, { payment_status: "verified" });
      setSuccessMsg("Payment verified.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally { setSaving(false); }
  }

  async function rejectPayment() {
    setSaving(true); setError(null); setSuccessMsg(null);
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
      setSuccessMsg("Payment rejected.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed.");
    } finally { setSaving(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal container — tall enough to show everything */}
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "92vh" }}
      >

        {/* Header — fixed */}
        <div className="shrink-0 flex items-start justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base font-bold text-stone-900">#{order.order_number}</p>
              <PaymentStatusBadge status={order.payment_status} />
              <OrderStatusBadge status={order.order_status} />
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {new Date(order.created_at).toLocaleString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <button onClick={onClose} className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Customer */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Customer</p>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-stone-900">{order.customer_name}</p>
                {order.state_code && <p className="text-xs font-bold text-[#FC0003]">{order.state_code}</p>}
                <p className="text-sm text-stone-500 mt-1">{order.phone}</p>
                <p className="text-sm text-stone-500">{order.email}</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.phone}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-500 hover:bg-stone-100">
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a href={`mailto:${order.email}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-500 hover:bg-stone-100">
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Delivery</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900 capitalize">{order.order_type}</p>
                {order.delivery_location && <p className="text-sm text-stone-500">{order.delivery_location}</p>}
              </div>
            </div>
            {order.delivery_note && (
              <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <p className="text-xs text-amber-700"><span className="font-semibold">Note:</span> {order.delivery_note}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-4 py-3 border-b border-stone-100">Items</p>
            {order.order_items.length === 0 ? (
              <p className="px-4 py-3 text-sm text-stone-400">No items found.</p>
            ) : (
              <>
                <div className="divide-y divide-stone-50">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-stone-900">{item.item_name}</p>
                        <p className="text-xs text-stone-400">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 bg-stone-50 px-4 py-3 space-y-1">
                  {order.takeaway_fee > 0 && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Takeaway packaging</span><span>{formatCurrency(order.takeaway_fee)}</span>
                    </div>
                  )}
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Delivery fee</span><span>{formatCurrency(order.delivery_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total</span>
                    <span className="text-[#FC0003]">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Payment receipt */}
          {order.receipt_url ? (
            <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-4 py-3 border-b border-stone-100">
                Payment Receipt
              </p>
              <div className="p-4 space-y-3">
                {/* Show image directly — no toggle */}
                <img
                  src={order.receipt_url}
                  alt="Payment receipt"
                  className="w-full rounded-lg border border-stone-200"
                  style={{ display: "block", minHeight: "200px", objectFit: "contain", background: "#f5f5f4" }}
                />
                <a
                  href={order.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs font-medium text-[#FC0003] hover:underline"
                >
                  Open full size ↗
                </a>
              </div>

              {/* Verify / Reject */}
              {order.payment_status === "pending" && (
                <div className="border-t border-stone-100 px-4 py-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Verify Payment</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={verifyPayment} loading={saving} className="flex-1">
                      Verify
                    </Button>
                    <Button size="sm" variant="danger" onClick={rejectPayment} loading={saving} className="flex-1">
                      Reject
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
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Payment Receipt</p>
              <p className="text-sm text-stone-400">No receipt uploaded.</p>
            </div>
          )}

          {/* Update status */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Update Order Status</p>
            <div className="flex gap-2">
              <Select
                options={ORDER_STATUS_OPTIONS}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="flex-1"
              />
              <Button size="sm" onClick={updateOrderStatus} loading={saving} disabled={orderStatus === order.order_status}>
                Update
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">{successMsg}</p>
            </div>
          )}

        </div>

        {/* Footer — fixed */}
        <div className="shrink-0 border-t border-stone-100 px-5 py-4">
          <Button variant="outline" onClick={onClose} className="w-full h-11">Close</Button>
        </div>

      </div>
    </div>
  );
}
