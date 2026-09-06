export default function Loading() {
  return (
    <main
      className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-[var(--accent)]/20 blur-xl" />
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-[var(--accent)]/40 [animation-duration:2.5s]" />
          <div className="absolute inset-1 animate-spin rounded-full border-2 border-dashed border-[var(--accent)]/70 [animation-duration:3s]" />
          <div className="absolute inset-4 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent)] border-l-[var(--accent)] [animation-duration:1.5s]" />
          <div className="relative h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
        </div>
        <div className="relative overflow-hidden text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
          <span className="opacity-90">Loading</span>
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent bg-clip-text text-transparent [animation-duration:2s]">
            Loading
          </span>
        </div>
      </div>
    </main>
  );
}
