"use client";

import { useState } from "react";
import { AppSettings, SETTING_KEYS } from "@/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface AdminSettingsFormProps {
  initialSettings: AppSettings;
}

type SavingState = "idle" | "saving" | "saved" | "error";

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [s, setS] = useState(initialSettings);
  const [state, setState] = useState<SavingState>("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
    setState("idle");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);

    const supabase = createClient();

    const rows = [
      { key: SETTING_KEYS.BUSINESS_NAME, value: s.businessName },
      { key: SETTING_KEYS.PHONE_1, value: s.phone1 },
      { key: SETTING_KEYS.PHONE_2, value: s.phone2 },
      { key: SETTING_KEYS.WHATSAPP, value: s.whatsapp },
      { key: SETTING_KEYS.EMAIL, value: s.email },
      { key: SETTING_KEYS.OPENING_HOURS, value: s.openingHours },
      { key: SETTING_KEYS.OPAY_ACCOUNT_NAME, value: s.opayAccountName },
      { key: SETTING_KEYS.OPAY_ACCOUNT_NUMBER, value: s.opayAccountNumber },
      { key: SETTING_KEYS.PAYMENT_PROVIDER, value: s.paymentProvider },
      { key: SETTING_KEYS.TAKEAWAY_FEE, value: String(s.takeawayFee) },
      { key: SETTING_KEYS.DELIVERY_FEE, value: String(s.deliveryFee) },
      { key: SETTING_KEYS.DELIVERY_ENABLED, value: String(s.deliveryEnabled) },
      { key: SETTING_KEYS.CAMP_DELIVERY_FEE, value: String(s.campDeliveryFee) },
      { key: SETTING_KEYS.CAMP_DELIVERY_ENABLED, value: String(s.campDeliveryEnabled) },
      { key: SETTING_KEYS.LOCATION_INSTRUCTIONS, value: s.locationInstructions },
    ].map((row) => ({ ...row, updated_at: new Date().toISOString() }));

    const { error: upsertError } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    if (upsertError) {
      setError("Failed to save settings. Please try again.");
      setState("error");
    } else {
      setState("saved");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">

      {/* Business info */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-200 pb-2">
          Business information
        </h2>
        <Input
          label="Business name"
          value={s.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone 1"
            value={s.phone1}
            onChange={(e) => update("phone1", e.target.value)}
          />
          <Input
            label="Phone 2"
            value={s.phone2}
            onChange={(e) => update("phone2", e.target.value)}
          />
        </div>
        <Input
          label="WhatsApp number"
          value={s.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={s.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <Input
          label="Opening hours"
          value={s.openingHours}
          onChange={(e) => update("openingHours", e.target.value)}
          placeholder="e.g. 7:00 AM – 10:00 PM"
        />
        <Textarea
          label="Location instructions"
          value={s.locationInstructions}
          onChange={(e) => update("locationInstructions", e.target.value)}
          rows={3}
          placeholder="Describe where customers can find you or get delivery"
        />
      </section>

      {/* Payment */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-200 pb-2">
          Payment details
        </h2>
        <Input
          label="Account name"
          value={s.opayAccountName}
          onChange={(e) => update("opayAccountName", e.target.value)}
        />
        <Input
          label="Account number"
          value={s.opayAccountNumber}
          onChange={(e) => update("opayAccountNumber", e.target.value)}
        />
        <Input
          label="Payment provider"
          value={s.paymentProvider}
          onChange={(e) => update("paymentProvider", e.target.value)}
          placeholder="e.g. OPay"
        />
      </section>

      {/* Fees */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-200 pb-2">
          Fees & delivery
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Takeaway packaging fee (₦)"
            type="number"
            min="0"
            value={s.takeawayFee}
            onChange={(e) => update("takeawayFee", Number(e.target.value))}
          />
          <Input
            label="Delivery fee (₦)"
            type="number"
            min="0"
            value={s.deliveryFee}
            onChange={(e) => update("deliveryFee", Number(e.target.value))}
            hint="Set to 0 for free delivery"
          />
        </div>

        {/* Delivery enabled toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={s.deliveryEnabled}
            onClick={() => update("deliveryEnabled", !s.deliveryEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${
              s.deliveryEnabled ? "bg-stone-900" : "bg-stone-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                s.deliveryEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm text-stone-700">
            Delivery {s.deliveryEnabled ? "enabled" : "disabled"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Camp delivery fee (₦)"
            type="number"
            min="0"
            value={s.campDeliveryFee}
            onChange={(e) => update("campDeliveryFee", Number(e.target.value))}
          />
        </div>

        {/* Camp delivery enabled toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={s.campDeliveryEnabled}
            onClick={() => update("campDeliveryEnabled", !s.campDeliveryEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${
              s.campDeliveryEnabled ? "bg-stone-900" : "bg-stone-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                s.campDeliveryEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm text-stone-700">
            Camp delivery {s.campDeliveryEnabled ? "enabled" : "disabled"}
          </span>
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" loading={state === "saving"}>
          Save settings
        </Button>
        {state === "saved" && (
          <p className="text-sm text-green-600">Settings saved.</p>
        )}
      </div>
    </form>
  );
}
