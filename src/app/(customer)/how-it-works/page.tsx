import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | Famous Kitchen",
  description:
    "Three simple steps to order from Famous Kitchen — choose your food, make payment, receive your meal.",
};

const STEPS = [
  {
    step: "1",
    title: "Choose your food",
    body: "Browse the menu and add your meals to your order. You can add multiple items and adjust quantities before checking out.",
    cta: { label: "Browse menu", href: "/menu" },
  },
  {
    step: "2",
    title: "Fill in your details",
    body: "Enter your name, phone number, and email. Choose whether you want pickup or delivery. If delivery, select your location around camp.",
    cta: null,
  },
  {
    step: "3",
    title: "Make payment",
    body: "Transfer the exact order total to our OPay account. Take a screenshot of the receipt and upload it during checkout.",
    detail: {
      label: "Payment account",
      lines: ["Account name: AYOADE OKIKI", "Account number: 8109840858", "Provider: OPay"],
    },
    cta: null,
  },
  {
    step: "4",
    title: "Wait for confirmation",
    body: "Once you submit your order, we receive it and review your payment receipt. We will confirm your order and prepare your food.",
    cta: null,
  },
  {
    step: "5",
    title: "Receive your food",
    body: "Pick up from Famous Kitchen or we deliver to your chosen location around camp. You can also send your order details on WhatsApp to follow up.",
    cta: { label: "Contact on WhatsApp", href: "/contact" },
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FC0003]">
          Famous Kitchen
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          How it works
        </h1>
        <p className="mt-2 text-base text-stone-500">
          Ordering from Famous Kitchen takes less than two minutes.
        </p>
      </div>

      {/* Steps */}
      <ol className="relative" aria-label="Order steps">
        {STEPS.map(({ step, title, body, cta, detail }, idx) => (
          <li key={step} className="flex gap-6 pb-10 last:pb-0">
            {/* Step indicator + connector */}
            <div className="flex flex-col items-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FC0003] text-sm font-bold text-white">
                {step}
              </div>
              {idx < STEPS.length - 1 && (
                <div className="mt-2 w-px flex-1 bg-stone-200" aria-hidden />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 pb-4">
              <h2 className="text-base font-semibold text-stone-900">{title}</h2>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{body}</p>

              {detail && (
                <div className="mt-3 rounded border border-stone-200 bg-stone-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
                    {detail.label}
                  </p>
                  {detail.lines.map((line) => (
                    <p key={line} className="text-sm text-stone-700">{line}</p>
                  ))}
                </div>
              )}

              {cta && (
                <Link
                  href={cta.href}
                  className="mt-3 inline-flex h-9 items-center rounded bg-[#FC0003] px-4 text-sm font-medium text-white hover:bg-[#d40002] transition-colors"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Bottom CTA */}
      <div className="mt-6 rounded border border-[#FC0003]/20 bg-red-50 p-5">
        <p className="text-sm font-semibold text-stone-900">Ready to order?</p>
        <p className="mt-1 text-sm text-stone-600">
          Head to the menu and place your order now.
        </p>
        <Link
          href="/menu"
          className="mt-3 inline-flex h-10 items-center rounded bg-[#FC0003] px-5 text-sm font-semibold text-white hover:bg-[#d40002] transition-colors"
        >
          Go to menu
        </Link>
      </div>
    </div>
  );
}
