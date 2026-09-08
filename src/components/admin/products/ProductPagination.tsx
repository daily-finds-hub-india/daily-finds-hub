'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFilteredCount: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalFilteredCount,
  onPageChange
}: ProductPaginationProps) {
  if (totalFilteredCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border)] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="text-center text-xs font-medium text-[var(--text-muted)] sm:text-left">
        Showing{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {startIndex + 1}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {Math.min(endIndex, totalFilteredCount)}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {totalFilteredCount}
        </span>{' '}
        products
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:hover:bg-[var(--surface-muted)]/50"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="px-2 text-xs font-bold text-[var(--text-primary)]">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-40 disabled:hover:bg-[var(--surface-muted)]/50"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
