"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, LogOut } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-stone-200 bg-white md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-stone-200 px-4">
          <Link href="/admin" aria-label="Famous Kitchen Admin — home">
            <img
              src="https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png"
              alt="Famous Kitchen"
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-stone-100 font-medium text-stone-900"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-100 p-3">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4">
        <Link href="/admin" aria-label="Famous Kitchen Admin — home">
          <img
            src="https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png"
            alt="Famous Kitchen"
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-stone-200 bg-white"
        aria-label="Mobile admin navigation"
      >
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                active ? "text-stone-900" : "text-stone-400"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 pb-16 md:pt-0 md:pb-0">
        {children}
      </main>
    </div>
  );
}
