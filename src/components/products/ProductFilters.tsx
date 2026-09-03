'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Select } from '@/components/ui/Select';

type Category = {
  id: string;
  name: string;
};

interface ProductFiltersProps {
  categories: Category[];
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
  { value: 'rating', label: 'Top rated' }
];

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? 'all';
  const activeSort = searchParams.get('sort') ?? 'featured';

  const filterCategories = [{ id: 'all', name: 'All' }, ...categories];

  function updateFilter(key: 'category' | 'sort', value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all' || value === 'featured') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();

    router.push(query ? `/products?${query}` : '/products', {
      scroll: false
    });
  }

  return (
    <div className="mb-12 border-y border-[var(--border)] py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="themed-scrollbar flex gap-2 overflow-x-auto pb-1 lg:pb-0"
          role="group"
          aria-label="Filter by category"
        >
          {filterCategories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => updateFilter('category', category.id)}
                className={[
                  'shrink-0 border px-4 py-2 text-sm transition-colors duration-200',
                  isActive
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--background)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                ].join(' ')}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center">
          <Select
            label="Sort"
            value={activeSort}
            options={sortOptions}
            align="left"
            onChange={(value) => updateFilter('sort', value)}
          />
        </div>
      </div>
    </div>
  );
}
