import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/settings";
import { OrderConfirmationContent } from "./OrderConfirmationContent";

export default async function OrderConfirmationPage() {
  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from("settings").select("*");
  const settings = parseSettings(settingsRows ?? []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Suspense fallback={<div className="text-sm text-stone-400">Loading order details…</div>}>
        <OrderConfirmationContent settings={settings} />
      </Suspense>
    </div>
  );
}
