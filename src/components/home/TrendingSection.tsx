import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';

import type { Product } from '@/types/product';

interface TrendingSectionProps {
  products: Product[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const trendingProducts = products.slice(0, 4);

  if (trendingProducts.length === 0) {
    return (
      <Section className="border-t border-[var(--border)]">
        <Container>
          <EmptyState
            eyebrow="Trending now"
            title="No trending finds yet."
            description="Products will appear here as they start getting attention."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="border-t border-[var(--border)]">
      <Container>
        <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What's getting attention"
            title="Trending now."
            description="Interesting finds that are catching people's attention right now."
          />

          <Link
            href="/products"
            className="group inline-flex min-h-9 w-fit shrink-0 items-center gap-2 border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span>See all finds</span>

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <ProductGrid products={trendingProducts} />
        </div>
      </Container>
    </Section>
  );
}
