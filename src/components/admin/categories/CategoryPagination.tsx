import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFilteredCount: number;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalFilteredCount,
  onPageChange
}: CategoryPaginationProps) {
  if (totalFilteredCount === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] p-4 sm:flex-row sm:px-5">
      <p className="text-xs text-[var(--text-muted)]">
        Showing{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {startIndex + 1}–{Math.min(endIndex, totalFilteredCount)}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {totalFilteredCount}
        </span>{' '}
        categories
      </p>

      {totalPages > 1 ? (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous Page"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <span className="px-2 text-xs font-medium text-[var(--text-muted)]">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next Page"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
