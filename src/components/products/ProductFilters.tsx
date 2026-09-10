'use client';

import { Select } from '@/components/ui/Select';

type Category = {
  id: string;
  name: string;
};

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string;
  activeSort: string;
  onFilterChange: (key: 'category' | 'sort', value: string) => void;
  disabled?: boolean;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'reviews', label: 'Most reviewed' }
];

export function ProductFilters({
  categories,
  activeCategory,
  activeSort,
  onFilterChange,
  disabled = false
}: ProductFiltersProps) {
  const filterCategories = [
    {
      id: 'all',
      name: 'All'
    },
    ...categories
  ];

  return (
    <div className="mb-12 border-y border-[var(--border)] py-4 sm:py-5">
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div
          className="
            themed-scrollbar
            -mx-1
            flex
            min-w-0
            gap-2
            overflow-x-auto
            px-1
            pb-1
            lg:mx-0
            lg:px-0
            lg:pb-0
          "
          role="group"
          aria-label="Filter by category"
        >
          {filterCategories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                disabled={disabled}
                onClick={() => onFilterChange('category', category.id)}
                aria-pressed={isActive}
                className={[
                  'min-h-10 shrink-0 rounded-full border px-4 py-2 text-xs font-semibold shadow-xs transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
                  disabled ? 'cursor-wait opacity-60' : '',
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] font-bold text-[var(--accent-text)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
                ].join(' ')}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="flex w-full shrink-0 items-center lg:w-auto">
          <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
            <Select
              label="Sort"
              value={activeSort}
              options={sortOptions}
              align="left"
              onChange={(value) => onFilterChange('sort', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
