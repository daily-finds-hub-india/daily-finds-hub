import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/products/ProductCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { products } from '@/data/products';

export function FeaturedProducts() {
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 3);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Curated for you"
            title="Today's finds"
            description="A few useful and interesting products we've come across recently."
          />

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:self-auto"
          >
            View all
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
