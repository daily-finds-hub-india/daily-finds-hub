interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <div className="border-t border-[var(--border)] py-16 sm:py-20">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
