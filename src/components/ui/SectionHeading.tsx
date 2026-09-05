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
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.045em] text-[var(--text-primary)]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
