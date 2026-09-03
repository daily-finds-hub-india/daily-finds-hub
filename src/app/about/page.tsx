import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About',
  description:
    'Learn more about Daily Finds Hub India and what we look for when discovering products.'
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About the hub"
        title="Useful things are worth finding."
        description="Daily Finds Hub India is a place for discovering clever gadgets, useful everyday products, and interesting things that deserve a closer look."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                What we do
              </p>
            </div>

            <div className="max-w-3xl space-y-8 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              <p>
                There are thousands of products out there. Some are genuinely
                useful. Some solve a small everyday problem. And some are just
                surprisingly clever.
              </p>

              <p>
                We try to find the ones worth knowing about and bring them
                together in one simple place.
              </p>

              <p>
                From kitchen gadgets and home finds to everyday tech, our goal
                is straightforward: help you discover products that might
                actually make your day a little easier or more interesting.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Useful
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Products should solve something or make everyday life better.
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Curious
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                We like products that make you stop and think, “Why didn&apos;t
                I know about this?”
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Simple
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                No unnecessary noise. Just products worth discovering.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
