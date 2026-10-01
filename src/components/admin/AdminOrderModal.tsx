"use client";

import { useState, useEffect } from "react";
import { OrderWithItems, OrderStatus, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { PaymentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { X, Phone, Mail, MapPin, Receipt, ChevronDown, ChevronUp } from "lucide-react";

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
  const [showReceipt, setShowReceipt] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
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
      setSuccessMsg("Payment verified successfully.");
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.order_number}`}
    >
      <div className="w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl sm:max-w-lg flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-stone-100 px-5 py-4 shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-bold text-stone-900">#{order.order_number}</p>
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
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition-colors shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-5">

          {/* Customer card */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Customer</p>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-stone-900">{order.customer_name}</p>
                {order.state_code && (
                  <p className="text-xs font-bold text-[#FC0003] mt-0.5">{order.state_code}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={`tel:${order.phone}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label="Call customer"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`mailto:${order.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label="Email customer"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <p className="text-sm text-stone-600">{order.phone}</p>
              <p className="text-sm text-stone-600">{order.email}</p>
            </div>
          </div>

          {/* Delivery card */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Delivery</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900 capitalize">{order.order_type}</p>
                {order.delivery_location && (
                  <p className="text-sm text-stone-500">{order.delivery_location}</p>
                )}
              </div>
            </div>
            {order.delivery_note && (
              <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Note:</span> {order.delivery_note}
                </p>
              </div>
            )}
          </div>

          {/* Order items */}
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Items</p>
            </div>
            <div className="divide-y divide-stone-50">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{item.item_name}</p>
                    <p className="text-xs text-stone-400">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="border-t border-stone-100 px-4 py-3 bg-stone-50 space-y-1">
              {order.takeaway_fee > 0 && (
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Takeaway packaging</span>
                  <span>{formatCurrency(order.takeaway_fee)}</span>
                </div>
              )}
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Delivery fee</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total</span>
                <span className="text-[#FC0003]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment receipt */}
          {order.receipt_url && (
            <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
              <button
                onClick={() => setShowReceipt((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-stone-400" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Payment Receipt</p>
                </div>
                {showReceipt
                  ? <ChevronUp className="h-4 w-4 text-stone-400" />
                  : <ChevronDown className="h-4 w-4 text-stone-400" />
                }
              </button>

              {showReceipt && (
                <div className="px-4 pb-4">
                  <div className="relative w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                    <img
                      src={order.receipt_url}
                      alt="Payment receipt"
                      className="w-full h-auto object-contain max-h-96"
                    />
                    <a
                      href={order.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#FC0003] hover:underline"
                    >
                      Open full size
                    </a>
                  </div>
                </div>
              )}

              {/* Payment actions — only show when pending */}
              {order.payment_status === "pending" && (
                <div className="border-t border-stone-100 px-4 py-4 flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Verify Payment</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={verifyPayment}
                      loading={saving}
                      className="flex-1"
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={rejectPayment}
                      loading={saving}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Rejection reason (optional — customer will see this)"
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Update order status */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Update Order Status</p>
            <div className="flex gap-2">
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
                className="shrink-0"
              >
                Update
              </Button>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p role="alert" className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700 font-medium">{successMsg}</p>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="border-t border-stone-100 px-5 py-4 shrink-0 bg-white">
          <Button variant="outline" onClick={onClose} className="w-full h-11">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
