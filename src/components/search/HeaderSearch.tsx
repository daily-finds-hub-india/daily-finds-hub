'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';

import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface HeaderSearchProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function HeaderSearch({ isOpen, onOpen, onClose }: HeaderSearchProps) {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const productResults = normalizedQuery
    ? products.filter((product) => {
        const searchText = [product.name, product.description, product.category]
          .join(' ')
          .toLowerCase();

        return searchText.includes(normalizedQuery);
      })
    : [];

  const categoryResults = normalizedQuery
    ? categories.filter((category) => {
        const searchText = [category.name, category.description]
          .join(' ')
          .toLowerCase();

        return searchText.includes(normalizedQuery);
      })
    : [];

  const hasResults = productResults.length > 0 || categoryResults.length > 0;

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center',
        isOpen &&
          'max-sm:absolute max-sm:left-0 max-sm:right-0 max-sm:top-full max-sm:border-b max-sm:border-[var(--border)] max-sm:bg-[var(--background)]'
      )}
    >
      <div
        className={cn(
          'flex items-center overflow-hidden transition-[width] duration-300 ease-out',
          isOpen
            ? 'w-[min(22rem,42vw)] max-sm:w-full max-sm:px-5 max-sm:py-3'
            : 'w-10'
        )}
      >
        {!isOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>
        ) : (
          <div className="flex h-10 w-full items-center border-b border-[var(--text-primary)] max-sm:h-11">
            <Search
              size={17}
              strokeWidth={1.8}
              className="mr-2 shrink-0 text-[var(--text-muted)]"
            />

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search finds..."
              aria-label="Search products and categories"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={16} strokeWidth={1.8} />
            </button>
          </div>
        )}
      </div>

      {isOpen && normalizedQuery && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(26rem,80vw)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] max-sm:left-0 max-sm:right-0 max-sm:top-[calc(100%+0.75rem)] max-sm:w-full">
          {!hasResults ? (
            <div className="px-5 py-6">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No finds yet.
              </p>

              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                Nothing matched &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {productResults.length > 0 && (
                <div>
                  <div className="border-b border-[var(--border)] px-5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Products
                    </p>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {productResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={handleClose}
                        className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-muted)]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                            {product.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">
                            {product.description}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.7}
                          className="shrink-0 text-[var(--text-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {categoryResults.length > 0 && (
                <div>
                  <div className="border-b border-t border-[var(--border)] px-5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Categories
                    </p>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {categoryResults.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={handleClose}
                        className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-muted)]"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                            {category.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">
                            {category.description}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.7}
                          className="shrink-0 text-[var(--text-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
