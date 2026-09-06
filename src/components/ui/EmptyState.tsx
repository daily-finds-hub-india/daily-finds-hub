interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <div className="border-t border-[var(--border)] py-12 sm:py-16 lg:py-20">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)] sm:text-xs">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-[var(--text-primary)] sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
