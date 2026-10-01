import { MenuItem } from "@/types";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemSkeleton } from "@/components/ui/Skeleton";

interface MenuGridProps {
  items: MenuItem[];
  loading?: boolean;
}

export function MenuGrid({ items, loading = false }: MenuGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-500">No menu items available right now.</p>
        <p className="mt-1 text-sm text-stone-400">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
