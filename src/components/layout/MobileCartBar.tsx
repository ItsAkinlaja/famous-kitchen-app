"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileCartBar() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const pathname = usePathname();

  // Prevent hydration mismatch — cart is in localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Don't show on checkout or order-confirmation — it overlaps the receipt upload
  const hidden = pathname.startsWith("/checkout") || pathname.startsWith("/order-confirmation");

  if (!mounted || hidden) return null;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = getSubtotal();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 md:hidden">
      <Link
        href="/checkout"
        className="flex items-center justify-between w-full rounded-xl bg-[#FC0003] px-4 py-3.5 text-white shadow-lg hover:bg-[#d40002] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in order
          </span>
        </div>
        <span className="text-sm font-semibold">{formatCurrency(subtotal)}</span>
      </Link>
    </div>
  );
}
