import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-stone-200", className)}
      aria-hidden="true"
    />
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex flex-col gap-3 border border-stone-200 rounded p-4">
      <Skeleton className="h-40 w-full rounded" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
