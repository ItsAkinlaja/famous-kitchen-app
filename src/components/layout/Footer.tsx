import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">

      {/* Main footer grid */}
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <img
              src="https://ik.imagekit.io/scmchurch/Red_Fk_Chef_Logo_Emblem-removebg-preview.png"
              alt="Famous Kitchen"
              className="h-20 w-auto object-contain"
            />
            <p className="mt-3 text-sm text-stone-400 leading-relaxed max-w-xs">
              Good food, made simple. Pre-order your meal and get it delivered
              around NYSC camp, Imo State. Open every day.
            </p>
            <div className="mt-5 flex flex-col gap-1.5">
              <a
                href="tel:08164969794"
                className="text-sm text-stone-400 hover:text-amber-400 transition-colors w-fit"
              >
                08164969794
              </a>
              <a
                href="tel:09127380726"
                className="text-sm text-stone-400 hover:text-amber-400 transition-colors w-fit"
              >
                09127380726
              </a>
              <a
                href="mailto:ayoadeokiki94@gmail.com"
                className="text-sm text-stone-400 hover:text-amber-400 transition-colors w-fit"
              >
                ayoadeokiki94@gmail.com
              </a>
              <p className="text-sm text-stone-500">7:00 AM – 10:00 PM daily</p>
            </div>
          </div>

          {/* Pages */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              Pages
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/contact", label: "Contact" },
                { href: "/checkout", label: "Checkout" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Order info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              Payment
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-stone-400">Account: AYOADE OKIKI</li>
              <li className="text-sm text-stone-400">Number: 8109840858</li>
              <li className="text-sm text-stone-400">Provider: OPay</li>
            </ul>

            <div className="mt-6">
              <a
                href="https://wa.me/2348164969794"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded bg-[#FC0003] px-4 text-xs font-semibold text-white hover:bg-[#d40002] transition-colors"
              >
                WhatsApp us
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Famous Kitchen. All rights reserved.
          </p>
          <p className="text-xs text-stone-500">
            Designed &amp; developed by{" "}
            <a
              href="https://www.akinlajatimileyin.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Akinlaja Timileyin
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}
