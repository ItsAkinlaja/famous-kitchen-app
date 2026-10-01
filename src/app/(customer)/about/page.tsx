import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Famous Kitchen",
  description:
    "Learn about Famous Kitchen — good food made simple for NYSC corpers at Imo State camp.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FC0003]">
          Our story
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          About Famous Kitchen
        </h1>
        <p className="mt-2 text-base text-stone-500">
          Good food, made simple — right here at NYSC Camp, Imo State.
        </p>
      </div>

      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <img
          src="https://ik.imagekit.io/scmchurch/Red_Fk_Chef_Logo_Emblem-removebg-preview.png"
          alt="Famous Kitchen logo"
          className="h-36 w-auto object-contain"
        />
      </div>

      {/* Story */}
      <div className="space-y-6 text-sm text-stone-700 leading-relaxed">

        <section className="rounded border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-3">Who we are</h2>
          <p>
            Famous Kitchen is a food vendor at the NYSC Orientation Camp in Imo State, Nigeria.
            We serve freshly prepared meals to corps members every day, from 7:00 AM to 10:00 PM.
            Our goal is simple — make sure every corper eats well during their three weeks at camp,
            without the stress of long queues or uncertainty about what's available.
          </p>
        </section>

        <section className="rounded border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-3">What we serve</h2>
          <p>
            Our menu covers everything from hearty meals like spaghetti, noodles, yam and egg sauce,
            and plantain, to lighter options like toasted bread, tea, coffee, and salad.
            We also serve chicken and beef for those who want extra protein.
            All meals are prepared fresh daily in our kitchen on camp.
          </p>
        </section>

        <section className="rounded border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-3">How we work</h2>
          <p>
            We built this online pre-ordering system so corpers can browse our menu, place their
            order, and make payment — all from their phone. No more waiting in line just to find
            out your meal isn't ready. Pre-order, pay via OPay transfer, upload your receipt,
            and we'll have your food ready for pickup or deliver it to your location around camp.
          </p>
        </section>

        <section className="rounded border border-stone-200 bg-white p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-3">Our commitment</h2>
          <p>
            We are committed to serving quality food at fair prices. Every order is personally
            verified by our team before preparation begins. If there's ever an issue with your
            order, reach us directly on WhatsApp and we'll sort it out immediately.
          </p>
        </section>

        {/* Contact CTA */}
        <div className="rounded border border-[#FC0003]/20 bg-red-50 p-6 text-center">
          <p className="font-semibold text-stone-900">Ready to order?</p>
          <p className="mt-1 text-stone-600">
            Browse our menu and place your order in under two minutes.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row justify-center">
            <Link
              href="/menu"
              className="inline-flex h-10 items-center justify-center rounded bg-[#FC0003] px-6 text-sm font-semibold text-white hover:bg-[#d40002] transition-colors"
            >
              View menu
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded border border-stone-300 bg-white px-6 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
