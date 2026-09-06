interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)] sm:text-[11px]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-[clamp(1.875rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
          {description}
        </p>
      )}
    </div>
  );
}
