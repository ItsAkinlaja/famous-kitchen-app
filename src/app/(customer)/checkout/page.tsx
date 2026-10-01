import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/settings";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Famous Kitchen",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from("settings").select("*");
  const settings = parseSettings(settingsRows ?? []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Complete your order
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Fill in your details, make payment, and upload your receipt.
        </p>
      </div>

      <CheckoutForm settings={settings} />
    </div>
  );
}
