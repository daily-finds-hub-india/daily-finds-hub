import { Container } from '@/components/layout/Container';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-[var(--border)]">
      <Container className="py-20 sm:py-28 lg:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {eyebrow}
        </p>

        <h1 className="mt-5 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[var(--text-primary)]">
          {title}
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
          {description}
        </p>
      </Container>
    </section>
  );
}
