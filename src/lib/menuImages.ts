import { MenuItem } from "@/types";

/**
 * Hardcoded fallback images by item name (case-insensitive).
 * Admin-uploaded image_url always takes priority over these.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
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

/**
 * Returns the display image URL for a menu item.
 * Admin-uploaded image_url wins; falls back to the hardcoded map.
 */
export function getMenuItemImage(item: MenuItem): string | null {
  if (item.image_url) return item.image_url;
  return FALLBACK_IMAGES[item.name.toLowerCase()] ?? null;
}
