function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-brand-950/10 bg-white shadow-soft">
      <div className="aspect-[16/10] animate-pulse bg-surface-200" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-20 animate-pulse rounded bg-surface-200" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-200" />
      </div>
    </div>
  );
}

export default function BlogSkeleton({ count = 6 }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}