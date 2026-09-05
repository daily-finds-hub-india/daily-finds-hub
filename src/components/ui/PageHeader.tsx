import { Container } from '@/components/layout/Container';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <Container className="relative">
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
            <span>{eyebrow}</span>
          </div>
        )}

        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
