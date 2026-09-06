import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';

import type { Product } from '@/types/product';

interface FeaturedSectionProps {
  products: Product[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const featuredProducts = products.slice(0, 3);

  if (featuredProducts.length === 0) {
    return (
      <Section>
        <Container>
          <EmptyState
            eyebrow="Today's finds"
            title="No featured finds yet."
            description="New products will appear here as soon as they are published."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Curated for you"
            title="Today's finds"
            description="A few useful and interesting products we've come across recently."
          />

          <Link
            href="/products"
            className="group inline-flex min-h-9 w-fit shrink-0 items-center gap-2 border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span>View all</span>

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <ProductGrid
            products={featuredProducts}
            className="lg:grid-cols-3 xl:grid-cols-3"
          />
        </div>
      </Container>
    </Section>
  );
}
