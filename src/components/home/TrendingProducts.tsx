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

interface TrendingProductsProps {
  products: Product[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
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
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="What's getting attention"
            title="Trending now."
            description="Interesting finds that are catching people's attention right now."
          />

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:self-auto"
          >
            See all finds
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
