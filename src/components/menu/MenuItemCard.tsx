"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/settings";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, X, ShoppingBag, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
}

// Fallback images by item name (case-insensitive match).
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

// Corper-friendly descriptions per item
const ITEM_DESCRIPTIONS: Record<string, { tagline: string; description: string; tags: string[] }> = {
  "spaghetti": {
    tagline: "The camp favourite 🍝",
    description: "Perfectly cooked spaghetti loaded with rich tomato sauce, seasoned proteins, and fresh veggies. This one hits different after a long parade ground session — trust us.",
    tags: ["Most popular", "Filling", "Hot & fresh"],
  },
  "noodles": {
    tagline: "Quick, hot & satisfying 🍜",
    description: "Stir-fried noodles packed with flavour and cooked to order. Light on your pocket, heavy on taste. Perfect for any time of day — breakfast, lunch or dinner.",
    tags: ["Quick ready", "Budget friendly", "Fan favourite"],
  },
  "yam and egg sauce": {
    tagline: "Classic Nigerian comfort food 🍳",
    description: "Soft boiled yam paired with a rich, spicy egg sauce. The kind of meal that reminds you of home. Proper, filling, and made with love — just like mama used to make.",
    tags: ["Nigerian classic", "Filling", "Home vibes"],
  },
  "plantain and egg sauce": {
    tagline: "Sweet meets savoury 🍌",
    description: "Ripe fried plantain with a perfectly seasoned egg sauce. The sweet-savoury combo that never gets old. A corper staple — simple, delicious, and always satisfying.",
    tags: ["Sweet & savoury", "Corper staple", "Energy boost"],
  },
  "toasted bread": {
    tagline: "Light bite, big energy ☕",
    description: "Golden crispy toast, perfect for breakfast or a quick snack between activities. Pair it with tea or coffee for the ultimate camp morning combo.",
    tags: ["Light snack", "Breakfast", "Quick pick-up"],
  },
  "tea": {
    tagline: "Your morning sorted ☕",
    description: "Warm, soothing tea to kick-start your day at camp. Whether you need to wake up for early morning parade or just want something calming — this is it.",
    tags: ["Morning essential", "Warm & soothing", "Pairs with bread"],
  },
  "coffee": {
    tagline: "Stay sharp, stay focused ☕",
    description: "Rich, bold coffee that cuts through the early morning fog. When 5AM parade feels like a punishment, this cup will get you through it. Corpers run on this.",
    tags: ["Energising", "Bold flavour", "Early morning saviour"],
  },
  "salad": {
    tagline: "Fresh & clean 🥗",
    description: "A crisp, fresh salad loaded with colourful veggies. Light but satisfying — perfect for when you want something healthy without sacrificing flavour. Your body will thank you.",
    tags: ["Healthy", "Fresh", "Light & clean"],
  },
  "chicken": {
    tagline: "Protein loading 🍗",
    description: "Juicy, well-seasoned chicken — the ultimate protein boost for corpers putting in work. Whether you're adding it to your meal or eating it solo, it hits every single time.",
    tags: ["High protein", "Juicy & tender", "Add-on available"],
  },
  "beef": {
    tagline: "For the meaty ones 🥩",
    description: "Tender, well-cooked beef with deep seasoning. Add it to any meal or have it on its own. The kind of protein that keeps you going through all the camp activities.",
    tags: ["High protein", "Tender cut", "Pairs with everything"],
  },
  "takeaway packaging": {
    tagline: "Take it anywhere on camp 📦",
    description: "Clean, sturdy takeaway packaging so your food stays fresh and secure wherever you go on camp. Perfect for delivery orders or eating in your hostel without the mess.",
    tags: ["For delivery", "Clean & secure", "Hostel friendly"],
  },
};

function getImageUrl(item: MenuItem): string | null {
  if (item.image_url) return item.image_url;
  return FALLBACK_IMAGES[item.name.toLowerCase()] ?? null;
}

function getItemInfo(name: string) {
  return ITEM_DESCRIPTIONS[name.toLowerCase()] ?? {
    tagline: "Fresh from our kitchen 🍽️",
    description: "Made fresh daily at Famous Kitchen. Pre-order now and have it ready when you need it — no queues, no stress.",
    tags: ["Fresh daily", "Made to order"],
  };
}

// ── Item Detail Modal ─────────────────────────────────────────────────────────
interface MenuItemModalProps {
  item: MenuItem;
  imageUrl: string | null;
  quantity: number;
  onClose: () => void;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

function MenuItemModal({ item, imageUrl, quantity, onClose, onAdd, onIncrease, onDecrease }: MenuItemModalProps) {
  const info = getItemInfo(item.name);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">

        {/* Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-stone-100">
              <span className="text-stone-400 text-sm">No image</span>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Unavailable badge */}
          {!item.is_available && (
            <div className="absolute top-3 left-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white">
              Currently unavailable
            </div>
          )}

          {/* Price badge on image */}
          <div className="absolute bottom-3 left-4">
            <span className="text-2xl font-bold text-white drop-shadow-md">
              {formatCurrency(item.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tagline */}
          <p className="text-xs font-semibold text-[#FC0003] uppercase tracking-widest">
            {info.tagline}
          </p>

          {/* Name */}
          <h2 className="mt-1 text-xl font-bold text-stone-900">{item.name}</h2>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {info.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600"
              >
                <Zap className="h-2.5 w-2.5 text-[#FC0003]" />
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            {item.description || info.description}
          </p>

          {/* Divider */}
          <div className="mt-4 border-t border-stone-100" />

          {/* Cart actions */}
          <div className="mt-4">
            {!item.is_available ? (
              <div className="flex items-center justify-center rounded-xl bg-stone-100 py-3">
                <p className="text-sm font-medium text-stone-400">
                  Not available right now — check back soon
                </p>
              </div>
            ) : quantity === 0 ? (
              <Button
                className="w-full h-12 text-base rounded-xl gap-2"
                onClick={() => { onAdd(); onClose(); }}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to order — {formatCurrency(item.price)}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2">
                  <button
                    onClick={onDecrease}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-base font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={onIncrease}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FC0003] text-white hover:bg-[#d40002] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button
                  className="flex-1 h-12 text-sm rounded-xl"
                  onClick={onClose}
                >
                  Done — {quantity} in order
                </Button>
              </div>
            )}
          </div>

          {/* Checkout nudge */}
          {quantity > 0 && (
            <p className="mt-2 text-center text-xs text-stone-400">
              Go to checkout when you&apos;re ready to place your order
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function MenuItemCard({ item }: MenuItemCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const cartItem = cartItems.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity ?? 0;
  const imageUrl = getImageUrl(item);

  function handleAdd() {
    addItem({ menuItemId: item.id, name: item.name, price: item.price, imageUrl });
  }
  function handleIncrease() { updateQuantity(item.id, quantity + 1); }
  function handleDecrease() {
    if (quantity === 1) removeItem(item.id);
    else updateQuantity(item.id, quantity - 1);
  }

  return (
    <>
      <article
        className={cn(
          "flex flex-col border border-stone-200 rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-md",
          !item.is_available && "opacity-60"
        )}
      >
        {/* Clickable image */}
        <button
          onClick={() => setModalOpen(true)}
          className="relative h-44 w-full bg-stone-100 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FC0003] group"
          aria-label={`View details for ${item.name}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-xs text-stone-400">No image</span>
            </div>
          )}
          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
              View details
            </span>
          </div>
        </button>

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
              <span className="text-xs text-stone-400 font-medium">Unavailable</span>
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

      {/* Detail modal */}
      {modalOpen && (
        <MenuItemModal
          item={item}
          imageUrl={imageUrl}
          quantity={quantity}
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      )}
    </>
  );
}
