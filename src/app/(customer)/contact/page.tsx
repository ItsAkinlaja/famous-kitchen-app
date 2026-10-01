import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact | Famous Kitchen",
  description:
    "Contact Famous Kitchen by phone, WhatsApp, or email. Open 7:00 AM – 10:00 PM around NYSC camp, Imo State.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from("settings").select("*");
  const settings = parseSettings(settingsRows ?? []);

  const waNumber = `234${settings.whatsapp.replace(/^0/, "")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FC0003]">
          Famous Kitchen
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Contact us
        </h1>
        <p className="mt-2 text-base text-stone-500">
          Reach us by phone, WhatsApp, or email. We&apos;re open{" "}
          <strong className="text-stone-700">{settings.openingHours}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Phone */}
        <div className="rounded border border-stone-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Phone
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={`tel:${settings.phone1}`}
              className="text-base font-medium text-stone-900 hover:text-[#FC0003] transition-colors"
            >
              {settings.phone1}
            </a>
            {settings.phone2 && (
              <a
                href={`tel:${settings.phone2}`}
                className="text-base font-medium text-stone-900 hover:text-[#FC0003] transition-colors"
              >
                {settings.phone2}
              </a>
            )}
          </div>
          <p className="mt-3 text-xs text-stone-400">Tap to call</p>
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded border border-stone-200 bg-white p-5 transition-colors hover:border-[#FC0003]/30 hover:bg-red-50 block"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            WhatsApp
          </p>
          <p className="mt-3 text-base font-medium text-stone-900 group-hover:text-[#FC0003]">
            {settings.whatsapp}
          </p>
          <p className="mt-3 text-xs font-medium text-[#FC0003]">
            Open chat →
          </p>
        </a>

        {/* Email */}
        <a
          href={`mailto:${settings.email}`}
          className="group rounded border border-stone-200 bg-white p-5 transition-colors hover:border-[#FC0003]/30 hover:bg-red-50 block"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Email
          </p>
          <p className="mt-3 text-sm font-medium text-stone-900 break-all group-hover:text-[#FC0003]">
            {settings.email}
          </p>
          <p className="mt-3 text-xs font-medium text-[#FC0003]">
            Send email →
          </p>
        </a>

        {/* Hours */}
        <div className="rounded border border-stone-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Opening hours
          </p>
          <p className="mt-3 text-base font-medium text-stone-900">
            {settings.openingHours}
          </p>
          <p className="mt-1 text-sm text-stone-500">Every day</p>
        </div>
      </div>

      {/* Location */}
      <div className="mt-4 rounded border border-stone-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          Location
        </p>
        <p className="mt-3 text-sm text-stone-700 leading-relaxed">
          {settings.locationInstructions}
        </p>
        <div className="mt-4 flex flex-col gap-1.5">
          {["Entrance of the Hall", "NYSC Kitchen Entrance", "Clinic (emergency delivery available)"].map((loc) => (
            <div key={loc} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#FC0003] shrink-0" />
              <p className="text-sm text-stone-600">{loc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-6 rounded border border-[#FC0003]/20 bg-red-50 p-5">
        <p className="text-sm font-semibold text-stone-900">Prefer to order on WhatsApp?</p>
        <p className="mt-1 text-sm text-stone-600">
          Send us a message directly and we&apos;ll help you place your order.
        </p>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-10 items-center rounded bg-[#FC0003] px-5 text-sm font-semibold text-white hover:bg-[#d40002] transition-colors"
        >
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
