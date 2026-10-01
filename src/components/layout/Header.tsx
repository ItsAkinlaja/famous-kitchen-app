"use client";

import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";
import { ShoppingBag, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function Header() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalItems = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const subtotal = mounted ? getSubtotal() : 0;

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function navigate(href: string) {
    router.push(href);
    scrollTop();
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">

          {/* Brand */}
          <button onClick={() => navigate("/")} aria-label="Famous Kitchen — home">
            <img
              src="https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png"
              alt="Famous Kitchen"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-amber-50 font-medium text-amber-700"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Cart — only when items exist */}
            {totalItems > 0 && (
              <button
                onClick={() => navigate("/checkout")}
                aria-label={`View order — ${totalItems} item${totalItems !== 1 ? "s" : ""}, ${formatCurrency(subtotal)}`}
                className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors bg-[#FC0003] text-white hover:bg-[#d40002]"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span className="tabular-nums">
                  {totalItems} · {formatCurrency(subtotal)}
                </span>
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded text-stone-700 hover:bg-stone-100 transition-colors md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-14 right-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-white border-l border-stone-200 flex flex-col transition-transform duration-200 md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => { navigate(link.href); setMenuOpen(false); }}
                className={cn(
                  "flex items-center rounded px-3 py-3 text-sm font-medium transition-colors text-left w-full",
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-stone-100 p-4">
          <p className="text-xs text-stone-400">Open 7:00 AM – 10:00 PM</p>
          <a
            href="tel:08164969794"
            className="mt-1 block text-sm font-medium text-stone-700 hover:text-amber-600"
          >
            08164969794
          </a>
        </div>
      </div>
    </>
  );
}
