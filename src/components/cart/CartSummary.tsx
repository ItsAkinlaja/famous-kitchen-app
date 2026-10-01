"use client";

import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";
import { Minus, Plus, X } from "lucide-react";
import { AppSettings } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CartSummaryProps {
  settings: AppSettings;
  needsPackaging?: boolean;
  needsDeliveryFee?: boolean;
}

export function CartSummary({
  settings,
  needsPackaging = false,
  needsDeliveryFee = false,
}: CartSummaryProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const subtotal = getSubtotal();
  const takeawayFee = needsPackaging ? settings.takeawayFee : 0;
  const deliveryFee = needsDeliveryFee ? settings.deliveryFee : 0;
  const total = subtotal + takeawayFee + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-medium text-stone-700">Your order is empty</p>
        <p className="mt-1 text-sm text-stone-400">
          Add something from the menu to get started.
        </p>
        <Link href="/menu" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">
            View menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-stone-100" aria-label="Order items">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">
                {formatCurrency(item.price)} each
              </p>
            </div>

            <div
              className="flex items-center gap-1.5 shrink-0"
              role="group"
              aria-label={`${item.name} quantity`}
            >
              <button
                type="button"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
                className="flex h-7 w-7 items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span
                className="w-5 text-center text-sm font-medium text-stone-900"
                aria-live="polite"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
                className="flex h-7 w-7 items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <p className="w-16 text-right text-sm font-medium text-stone-900 shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.menuItemId)}
              aria-label={`Remove ${item.name} from order`}
              className="flex h-7 w-7 items-center justify-center rounded text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1.5 border-t border-stone-100 pt-4">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {takeawayFee > 0 && (
          <div className="flex justify-between text-sm text-stone-600">
            <span>Takeaway packaging</span>
            <span>{formatCurrency(takeawayFee)}</span>
          </div>
        )}
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm text-stone-600">
            <span>Delivery</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        )}
        {deliveryFee === 0 && needsDeliveryFee && (
          <div className="flex justify-between text-sm text-stone-600">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
        )}
        <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-semibold text-stone-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
