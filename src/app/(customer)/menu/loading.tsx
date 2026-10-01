import { MenuItemSkeleton } from "@/components/ui/Skeleton";

export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="h-7 w-20 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-stone-100" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
