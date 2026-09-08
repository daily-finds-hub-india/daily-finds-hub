'use client';

import { Search, Plus, ChevronDown } from 'lucide-react';
import { StatusFilter, SpotlightFilter, SortOption } from '@/types/category';

interface CategoryToolbarProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  spotlightFilter: SpotlightFilter;
  onSpotlightChange: (spotlight: SpotlightFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onAddCategory: () => void;
}

export function CategoryToolbar({
  totalCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  spotlightFilter,
  onSpotlightChange,
  sortOption,
  onSortChange,
  onAddCategory
}: CategoryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4">
      {/* Header Row: Title + Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
            Categories
          </h1>
          <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
            {totalCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onAddCategory}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 sm:h-10 sm:px-4"
        >
          <Plus size={15} strokeWidth={2.2} />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Controls Row: Search + Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories..."
            className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 pl-9 pr-3 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none sm:h-10"
          />
        </div>

        {/* Filter Selects Grid */}
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center">
          {/* Status Filter */}
          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              className="h-9 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 pl-2.5 pr-7 text-xs font-semibold text-[var(--text-secondary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none sm:h-10 sm:pl-3 sm:pr-8"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
          </div>

          {/* Spotlight Filter */}
          <div className="relative w-full md:w-auto">
            <select
              value={spotlightFilter}
              onChange={(e) =>
                onSpotlightChange(e.target.value as SpotlightFilter)
              }
              className="h-9 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 pl-2.5 pr-7 text-xs font-semibold text-[var(--text-secondary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none sm:h-10 sm:pl-3 sm:pr-8"
            >
              <option value="all">All Types</option>
              <option value="featured">Featured</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
          </div>

          {/* Sort Filter */}
          <div className="relative w-full md:w-auto">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 pl-2.5 pr-7 text-xs font-semibold text-[var(--text-secondary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none sm:h-10 sm:pl-3 sm:pr-8"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name A-Z</option>
              <option value="products">Products</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
