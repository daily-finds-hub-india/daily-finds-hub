export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-square animate-pulse bg-[var(--surface-muted)]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-20 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 animate-pulse rounded bg-[var(--surface-muted)]" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
