import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">

      {/* Logo */}
      <img
        src="https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png"
        alt="Famous Kitchen"
        className="h-20 w-auto object-contain"
      />

      {/* 404 badge */}
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#FC0003]">
        404 — Not Found
      </p>

      {/* Heading */}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
        This page left the kitchen
      </h1>

      {/* Subtext */}
      <p className="mt-3 max-w-sm text-sm text-stone-500 leading-relaxed">
        Looks like this page doesn&apos;t exist — maybe it was already eaten.
        Head back and place your order.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded bg-[#FC0003] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#d40002]"
        >
          Go home
        </Link>
        <Link
          href="/menu"
          className="inline-flex h-11 items-center justify-center rounded border border-stone-300 bg-white px-6 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          View menu
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-stone-400">
        Famous Kitchen · NYSC Camp, Imo State
      </p>

    </div>
  );
}
