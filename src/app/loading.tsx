export default function Loading() {
  return (
    <main
      className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center"
      aria-label="Loading"
    >
      <div className="flex items-center gap-3">
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"
          aria-hidden="true"
        />
        <span className="text-sm text-[var(--text-muted)]" role="status">
          Loading
        </span>
      </div>
    </main>
  );
}
