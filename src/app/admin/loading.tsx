function LoadingBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-[var(--surface-muted)] ${className}`} />
  );
}

export default function AdminLoading() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-8"
      aria-busy="true"
      aria-label="Loading admin workspace"
    >
      <div className="space-y-3">
        <LoadingBlock className="h-3 w-24" />
        <LoadingBlock className="h-10 w-52" />
        <LoadingBlock className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LoadingBlock className="h-32" />
        <LoadingBlock className="h-32" />
        <LoadingBlock className="h-32" />
      </div>
      <LoadingBlock className="h-40" />
    </div>
  );
}
