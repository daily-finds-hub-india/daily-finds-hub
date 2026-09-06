import { Info, ShieldCheck, Sparkles } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Affiliate Disclosure',
  description:
    'Learn how affiliate links work on Daily Finds Hub and how the site earns from qualifying purchases.'
};

export default function DisclosurePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Trust & transparency"
        title="Affiliate Disclosure"
        description="We believe you should know how this website works and how we may earn from the products we recommend."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <section className="disclosure-fade-up rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-slate-950">
                  <Info size={19} strokeWidth={2.2} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)] sm:text-xs">
                    Our disclosure
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl">
                    Amazon Associates
                  </h2>

                  <p className="mt-3 text-base font-semibold leading-7 text-[var(--text-primary)]">
                    As an Amazon Associate I earn from qualifying purchases.
                  </p>

                  <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)]">
                    Amazon and the Amazon logo are trademarks of Amazon.com,
                    Inc. or its affiliates.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-5 sm:grid-cols-2">
              <article className="disclosure-fade-up rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--accent)]">
                  <ShieldCheck size={20} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <h2 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
                  No extra cost
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  When you follow one of our affiliate links and make a
                  qualifying purchase, we may receive a commission. This does
                  not add an affiliate fee to the price you pay.
                </p>
              </article>

              <article
                className="disclosure-fade-up rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)] sm:p-7"
                style={{ animationDelay: '70ms' }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--accent)]">
                  <Sparkles size={20} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <h2 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
                  Discovery comes first
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Our goal is to highlight products that we believe are
                  interesting, useful, or worth exploring. Affiliate
                  relationships are disclosed so you can make your own informed
                  decision.
                </p>
              </article>
            </section>

            <section
              className="disclosure-fade-up mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs sm:p-8 lg:p-10"
              style={{ animationDelay: '140ms' }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)] sm:text-xs">
                  Important information
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-2xl">
                  What happens after you click a link?
                </h2>
              </div>

              <div className="mt-8 space-y-7">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Prices and availability
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Product prices, discounts, availability, and delivery
                    information can change at any time. Information displayed on
                    Daily Finds Hub may therefore differ from the information
                    shown on Amazon.in. The retailer&apos;s listing at the time
                    of purchase is the relevant source for current pricing and
                    availability.
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-7">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Purchases and customer service
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Daily Finds Hub is a product discovery platform, not an
                    online store. We do not process purchases, collect payment
                    information, manage inventory, ship products, or handle
                    returns. Purchases and related customer service are handled
                    by the retailer and the applicable seller.
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-7">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Our relationship with Amazon
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Links to Amazon.in may contain affiliate tracking
                    information. If a qualifying purchase is made after
                    following an affiliate link, Daily Finds Hub may receive a
                    commission. This helps support the website and its ongoing
                    product discovery work.
                  </p>
                </div>
              </div>
            </section>

            <div
              className="disclosure-fade-up mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 sm:p-7"
              style={{ animationDelay: '210ms' }}
            >
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Our affiliate relationship does not require you to purchase
                anything. If you choose to buy a product, you should always
                consider whether it is right for your needs and review the
                retailer&apos;s current information before purchasing.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
