"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";

export function MobileCartBar() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = getSubtotal();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden">
      <Link
        href="/checkout"
        className="flex items-center justify-between w-full rounded bg-[#FC0003] px-4 py-3 text-white shadow-lg hover:bg-[#d40002] transition-colors"
      >
        <span className="text-sm font-medium">
          {totalItems} item{totalItems !== 1 ? "s" : ""} in order
        </span>
        <span className="text-sm font-semibold">{formatCurrency(subtotal)}</span>
      </Link>
    </div>
  );
}
