"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ReceiptUpload } from "./ReceiptUpload";
import { CartSummary } from "@/components/cart/CartSummary";
import {
  CheckoutFormData,
  CheckoutFormErrors,
  validateCheckoutForm,
} from "@/lib/validations";
import { useCartStore } from "@/store/cart";
import { AppSettings } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { CheckCircle } from "lucide-react";

const DELIVERY_LOCATIONS = [
  { value: "Entrance of the Hall", label: "Entrance of the Hall" },
  { value: "NYSC Kitchen Entrance", label: "NYSC Kitchen Entrance" },
  { value: "Clinic", label: "Clinic" },
  { value: "Other", label: "Other" },
];

interface CheckoutFormProps {
  settings: AppSettings;
}

const EMPTY_FORM: CheckoutFormData = {
  fullName: "",
  phone: "",
  email: "",
  stateCode: "",
  orderType: "pickup",
  deliveryLocation: "",
  deliveryLocationOther: "",
  orderNote: "",
};

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();

  // mounted must be declared first — used to gate localStorage-backed cart reads
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const mountedItems = mounted ? items : [];

  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderNumber: string; orderId: string } | null>(null);

  function update<K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const subtotal = mounted ? getSubtotal() : 0;
  const takeawayFee = form.orderType === "delivery" ? settings.takeawayFee : 0;
  const deliveryFee = form.orderType === "delivery" ? settings.deliveryFee : 0;
  const total = subtotal + takeawayFee + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (mountedItems.length === 0) {
      setServerError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!receiptUrl) {
      setReceiptError("Please upload your payment receipt before submitting.");
      return;
    }

    setSubmitting(true);

    const resolvedLocation =
      form.orderType === "delivery"
        ? form.deliveryLocation === "Other"
          ? form.deliveryLocationOther
          : form.deliveryLocation
        : null;

    const payload = {
      customerName: form.fullName,
      phone: form.phone,
      email: form.email,
      stateCode: form.stateCode,
      orderType: form.orderType,
      deliveryLocation: resolvedLocation,
      orderNote: form.orderNote,
      items: mountedItems.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      receiptUrl,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Order submission failed. Please try again.");
      }

      clearCart();
      setConfirmedOrder({ orderNumber: json.data.orderNumber, orderId: json.data.orderId });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Order placed modal ── */}
      {confirmedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-7 shadow-xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>

            {/* Heading */}
            <h2
              id="order-modal-title"
              className="mt-4 text-lg font-bold text-stone-900"
            >
              Order placed! 🎉
            </h2>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {confirmedOrder.orderNumber}
            </p>

            {/* Message */}
            <p className="mt-4 text-sm text-stone-600 leading-relaxed">
              Mr Famous is currently verifying your order. You will receive a
              message via <strong className="text-stone-800">WhatsApp</strong> once
              your order is confirmed and ready.
            </p>

            {/* CTA */}
            <Button
              className="mt-6 w-full"
              onClick={() =>
                router.push(
                  `/order-confirmation?order=${confirmedOrder.orderNumber}&id=${confirmedOrder.orderId}`
                )
              }
            >
              View order details
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Left: order summary + payment info */}
        <div>
          <h2 className="text-base font-semibold text-stone-900">Your order</h2>
          <div className="mt-4">
            <CartSummary
              settings={settings}
              needsPackaging={form.orderType === "delivery"}
              needsDeliveryFee={form.orderType === "delivery"}
            />
          </div>

          {mountedItems.length > 0 && (
            <div className="mt-4 rounded border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-700">Transfer payment to:</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-stone-600">
                  Account name: <strong className="text-stone-900">{settings.opayAccountName}</strong>
                </p>
                <p className="text-sm text-stone-600">
                  Account number: <strong className="text-stone-900">{settings.opayAccountNumber}</strong>
                </p>
                <p className="text-sm text-stone-600">
                  Provider: <strong className="text-stone-900">{settings.paymentProvider}</strong>
                </p>
              </div>
              <div className="mt-3 border-t border-stone-200 pt-3">
                <p className="text-sm font-semibold text-stone-900">
                  Amount to transfer: {formatCurrency(total)}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Transfer the exact amount, then upload your receipt below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: customer details + receipt */}
        <div className="flex flex-col gap-6">

          <div>
            <h2 className="text-base font-semibold text-stone-900">Your details</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Input
                label="Full name"
                placeholder="e.g. Chidi Okonkwo"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                error={errors.fullName}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="08012345678"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                error={errors.phone}
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="NYSC state code"
                placeholder="e.g. IM/24A/1234"
                required
                value={form.stateCode}
                onChange={(e) => update("stateCode", e.target.value)}
                error={errors.stateCode}
                hint="Your state code helps us identify your order quickly"
              />
            </div>
          </div>

          {/* Delivery or pickup radio */}
          <div>
            <h2 className="text-base font-semibold text-stone-900">Delivery or pickup?</h2>
            <div className="mt-4 flex flex-col gap-4">
              <fieldset>
                <legend className="text-sm font-medium text-stone-700">Order type</legend>
                <div className="mt-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={form.orderType === "pickup"}
                      onChange={() => update("orderType", "pickup")}
                      className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    <span className="text-sm text-stone-700 capitalize">Pickup</span>
                  </label>
                  {settings.deliveryEnabled && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        checked={form.orderType === "delivery"}
                        onChange={() => update("orderType", "delivery")}
                        className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-stone-500"
                      />
                      <span className="text-sm text-stone-700 capitalize">Delivery</span>
                    </label>
                  )}
                </div>
              </fieldset>

              {form.orderType === "delivery" && (
                <>
                  <Select
                    label="Delivery location"
                    placeholder="Select a location"
                    options={DELIVERY_LOCATIONS}
                    required
                    value={form.deliveryLocation}
                    onChange={(e) => update("deliveryLocation", e.target.value)}
                    error={errors.deliveryLocation}
                  />

                  {form.deliveryLocation === "Clinic" && (
                    <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-xs text-amber-700">
                        For delivery to the clinic, please ensure someone is available to receive the order.
                      </p>
                    </div>
                  )}

                  {form.deliveryLocation === "Other" && (
                    <Input
                      label="Describe your location"
                      placeholder="e.g. Block C, Room 12"
                      required
                      value={form.deliveryLocationOther}
                      onChange={(e) => update("deliveryLocationOther", e.target.value)}
                      error={errors.deliveryLocationOther}
                    />
                  )}
                </>
              )}

              <Textarea
                label="Order note (optional)"
                placeholder="Any special requests or instructions?"
                rows={2}
                value={form.orderNote}
                onChange={(e) => update("orderNote", e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-stone-900">Payment receipt</h2>
            <p className="mt-1 text-sm text-stone-500">
              Transfer {formatCurrency(total)} to the account above, then upload your receipt screenshot here.
            </p>
            <div className="mt-3">
              <ReceiptUpload
                onUploadComplete={(url) => {
                  setReceiptUrl(url);
                  setReceiptError(null);
                }}
                onUploadError={(err) => {
                  if (err) {
                    setReceiptUrl(null);
                    setReceiptError(err);
                  }
                }}
              />
              {receiptError && (
                <p role="alert" className="mt-1.5 text-xs text-red-600">
                  {receiptError}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            loading={submitting}
            disabled={mountedItems.length === 0}
            className="w-full"
          >
            {submitting ? "Placing order…" : "Place order"}
          </Button>

          <p className="text-center text-xs text-stone-400">
            Uploading a receipt does not automatically verify your payment. An admin will review and confirm your order.
          </p>
        </div>
      </div>
    </form>
    </>
  );
}
