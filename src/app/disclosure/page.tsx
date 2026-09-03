import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Affiliate Disclosure',
  description: 'Affiliate disclosure for Daily Finds Hub India.'
};

export default function DisclosurePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Transparency"
        title="Affiliate Disclosure"
        description="A quick explanation of how affiliate links work on Daily Finds Hub India."
      />

      <Section>
        <Container>
          <article className="max-w-3xl space-y-12 text-base leading-8 text-[var(--text-secondary)]">
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Our affiliate relationship
              </h2>

              <p className="mt-4">
                Some links on Daily Finds Hub India may be affiliate links. This
                means that if you click a link and make a qualifying purchase,
                we may receive a commission at no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Amazon Associates
              </h2>

              <p className="mt-4">
                Daily Finds Hub India participates in the Amazon Associates
                program, an affiliate advertising program designed to provide us
                with a way to earn fees by linking to Amazon.in and affiliated
                sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Our approach
              </h2>

              <p className="mt-4">
                Affiliate relationships do not change our goal of finding
                products that are genuinely useful, interesting, or worth
                considering. We encourage you to review the product details,
                price, availability, and reviews on the retailer&apos;s website
                before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Required disclosure
              </h2>

              <p className="mt-4">
                As an Amazon Associate I earn from qualifying purchases.
              </p>
            </section>
          </article>
        </Container>
      </Section>
    </main>
  );
}
