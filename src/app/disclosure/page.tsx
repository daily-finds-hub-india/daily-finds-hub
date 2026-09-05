import { ShieldCheck, Info, Sparkles } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Affiliate Disclosure',
  description:
    'Affiliate disclosure and transparency policy for Daily Finds Hub.'
};

export default function DisclosurePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Trust & Transparency"
        title="Affiliate Disclosure"
        description="We believe in complete transparency. Here is exactly how Daily Finds Hub operates and earns revenue."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Callout Card */}
            <div className="rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-slate-950 font-bold">
                  <Info size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Official Amazon Statement
                  </h2>
                  <p className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
                    &ldquo;As an Amazon Associate, Daily Finds Hub earns from
                    qualifying purchases.&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    Amazon and the Amazon logo are trademarks of Amazon.com,
                    Inc. or its affiliates.
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--accent)]">
                  <ShieldCheck size={20} strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                  No Cost to You
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Clicking an affiliate link does not increase the price you
                  pay. Amazon pays us a small referral commission directly out
                  of their margin, at zero additional cost to you.
                </p>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--accent)]">
                  <Sparkles size={20} strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                  Uncompromised Curation
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Affiliate partnerships do not influence what we recommend. If
                  a product isn&apos;t genuinely useful, clever, or worth
                  buying, it does not make our catalog.
                </p>
              </div>
            </div>

            {/* Detailed Policies Card */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Live Pricing & Availability
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                  Prices, discounts, and availability on Amazon change
                  frequently. While we strive to show accurate approximate
                  prices, the price listed on Amazon.in at the moment of
                  checkout is the final price.
                </p>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Third-Party Transactions
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                  Daily Finds Hub is a discovery platform, not an ecommerce
                  store. We do not process payments, store credit card details,
                  handle inventory, or manage shipping and returns. All
                  transactions, customer service, and warranties are fulfilled
                  directly by Amazon.in and its respective sellers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
