export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
      Draft
    </span>
  );
}
