import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';

export function DiscoveryCta() {
  return (
    <section className="border-t border-[var(--border)]">
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Keep exploring
            </p>

            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
              There&apos;s always
              <br />
              something worth finding.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              From clever kitchen tools to unexpected everyday gadgets, discover
              products that make you stop and think, &ldquo;I actually need
              that.&rdquo;
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)] lg:h-16 lg:w-16"
            aria-label="Explore all products"
          >
            <ArrowUpRight
              size={22}
              strokeWidth={1.6}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
