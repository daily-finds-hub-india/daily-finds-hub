'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Container } from '@/components/layout/Container';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PublicProductItem } from '@/lib/services/public-product';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

interface Category {
  id: string;
  name: string;
}

interface ProductsClientViewProps {
  categories: Category[];
  products: PublicProductItem[];
  searchHeading: string;
  searchEyebrow: string;
  description: string;
  emptyMessage: string;
}

export function ProductsClientView({
  categories,
  products,
  searchHeading,
  searchEyebrow,
  description,
  emptyMessage
}: ProductsClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') ?? 'all';
  const currentSort = searchParams.get('sort') ?? 'featured';

  const [activeCategory, setOptimisticCategory] = useOptimistic(
    currentCategory,
    (_, newCategory: string) => newCategory
  );

  const [activeSort, setOptimisticSort] = useOptimistic(
    currentSort,
    (_, newSort: string) => newSort
  );

  function handleFilterChange(key: 'category' | 'sort', value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all' || value === 'featured') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    const url = query ? `/products?${query}` : '/products';

    // 1. Immediately change address bar URL
    window.history.pushState(null, '', url);

    // 2. Trigger optimistic state update & server route transition
    startTransition(() => {
      if (key === 'category') setOptimisticCategory(value);
      if (key === 'sort') setOptimisticSort(value);
      router.replace(url, { scroll: false });
    });
  }

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow={searchEyebrow}
            title={searchHeading}
            description={description}
          />

          <div className="mt-8">
            <ProductFilters
              categories={categories}
              activeCategory={activeCategory}
              activeSort={activeSort}
              onFilterChange={handleFilterChange}
              disabled={isPending}
            />

            {isPending ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid products={products} emptyMessage={emptyMessage} />
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
