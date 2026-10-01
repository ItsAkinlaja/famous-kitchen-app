export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="h-7 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-stone-100" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
