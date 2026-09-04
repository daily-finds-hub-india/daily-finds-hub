import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/products/ProductCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: unknown;
  originalPrice: unknown;
  rating: unknown;
  reviewCount: number;
  amazonUrl: string | null;
  asin: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
};

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
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
