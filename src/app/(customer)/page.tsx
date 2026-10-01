import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Famous Kitchen | Good food. Made simple.",
  description:
    "Pre-order your meal from Famous Kitchen around NYSC camp, Imo State. Order online, pay by transfer, choose pickup or delivery.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200">
        <img
          src="https://ik.imagekit.io/scmchurch/images%20(1).jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-32">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              NYSC Camp · Imo State
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl leading-tight">
              Good food.<br />
              <span className="text-white/60">Made simple.</span>
            </h1>
            <p className="mt-5 text-base text-white/80 leading-relaxed max-w-md">
              Pre-order your meal and get it delivered around camp, or pick it
              up directly at Famous Kitchen.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex h-11 items-center justify-center rounded bg-[#FC0003] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#d40002] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC0003] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Order food
              </Link>
              <Link
                href="/menu"
                className="inline-flex h-11 items-center justify-center rounded border border-white/40 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                View menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                href: "/menu",
                title: "Menu",
                body: "Browse our full menu and add items to your order.",
                cta: "View menu",
              },
              {
                href: "/how-it-works",
                title: "How it works",
                body: "Three simple steps from choosing your food to receiving it.",
                cta: "Learn more",
              },
              {
                href: "/contact",
                title: "Contact us",
                body: "Reach us by phone, WhatsApp, or email. Open 7 AM – 10 PM.",
                cta: "Get in touch",
              },
            ].map(({ href, title, body, cta }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-2 rounded border border-stone-200 bg-white p-5 transition-colors hover:border-[#FC0003]/30 hover:bg-red-50"
              >
                <p className="text-sm font-semibold text-stone-900 group-hover:text-[#FC0003]">
                  {title}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed flex-1">{body}</p>
                <span className="mt-1 text-xs font-semibold text-[#FC0003]">
                  {cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="bg-white border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900">How it works</h2>
              <p className="mt-1 text-sm text-stone-500">Order in three simple steps.</p>
            </div>
            <Link
              href="/how-it-works"
              className="text-sm font-semibold text-[#FC0003] hover:text-[#d40002] transition-colors shrink-0 ml-4"
            >
              Full details →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose your food",
                body: "Browse the menu and add items to your order.",
              },
              {
                step: "2",
                title: "Make payment",
                body: "Transfer the total to our OPay account and upload your receipt.",
              },
              {
                step: "3",
                title: "Receive your food",
                body: "Pick up at Famous Kitchen or get it delivered around camp.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FC0003] text-sm font-bold text-white">
                  {step}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-stone-900">{title}</p>
                  <p className="mt-1 text-sm text-stone-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-stone-600">
              Ready to place your first order?
            </p>
            <Link
              href="/menu"
              className="inline-flex h-10 items-center rounded bg-[#FC0003] px-5 text-sm font-semibold text-white hover:bg-[#d40002] transition-colors shrink-0"
            >
              Order now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
