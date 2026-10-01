"use client";

import Image from "next/image";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";
import { Button } from "@/components/ui/Button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
}

// Fallback images by item name (case-insensitive match).
// The admin-uploaded image_url takes priority over these.
const FALLBACK_IMAGES: Record<string, string> = {
  "spaghetti":              "https://ik.imagekit.io/scmchurch/images%20(1).jpg?updatedAt=1790810761811",
  "noodles":                "https://ik.imagekit.io/scmchurch/images%20(2).jpg",
  "yam and egg sauce":      "https://ik.imagekit.io/scmchurch/sddefault.jpg",
  "plantain and egg sauce": "https://ik.imagekit.io/scmchurch/images%20(3).jpg",
  "toasted bread":          "https://ik.imagekit.io/scmchurch/hqdefault.jpg",
  "tea":                    "https://ik.imagekit.io/scmchurch/Masala-Chai-Tea-Recipe-Card.jpg",
  "coffee":                 "https://ik.imagekit.io/scmchurch/150929101049-black-coffee-stock.jpg",
  "salad":                  "https://ik.imagekit.io/scmchurch/healthy-cobb-salad-steps-sq-026.jpg",
  "chicken":                "https://ik.imagekit.io/scmchurch/1371589386937.webp",
  "beef":                   "https://ik.imagekit.io/scmchurch/images%20(4).jpg",
  "takeaway packaging":     "https://ik.imagekit.io/scmchurch/images%20(5).jpg",
};

function getImageUrl(item: MenuItem): string | null {
  // Admin-uploaded URL wins
  if (item.image_url) return item.image_url;
  // Fall back to hardcoded map
  return FALLBACK_IMAGES[item.name.toLowerCase()] ?? null;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const cartItem = cartItems.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity ?? 0;
  const imageUrl = getImageUrl(item);

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: imageUrl,
    });
  }

  function handleIncrease() {
    updateQuantity(item.id, quantity + 1);
  }

  function handleDecrease() {
    if (quantity === 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  }

  return (
    <article
      className={cn(
        "flex flex-col border border-stone-200 rounded bg-white overflow-hidden",
        !item.is_available && "opacity-60"
      )}
    >
      {/* Image */}
      {imageUrl ? (
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-44 w-full bg-stone-100 flex items-center justify-center">
          <span className="text-xs text-stone-400">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-stone-900">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-stone-500 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-semibold text-stone-900">
            {formatCurrency(item.price)}
          </p>

          {!item.is_available ? (
            <span className="text-xs text-stone-400 font-medium">
              Currently unavailable
            </span>
          ) : quantity === 0 ? (
            <Button size="sm" onClick={handleAdd} aria-label={`Add ${item.name}`}>
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-1" role="group" aria-label={`${item.name} quantity`}>
              <button
                onClick={handleDecrease}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium text-stone-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
