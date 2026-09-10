'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Loader2,
  Search,
  ShoppingBag,
  Tag,
  X
} from 'lucide-react';

import { useProductSearch } from '@/components/search/useProductSearch';
import { cn } from '@/lib/utils';

interface HeaderSearchProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function HeaderSearch({ isOpen, onOpen, onClose }: HeaderSearchProps) {
  const {
    query,
    setQuery,
    normalizedQuery,
    products,
    categories,
    isLoading,
    error,
    clearSearch
  } = useProductSearch();

  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasResults = products.length > 0 || categories.length > 0;
  const showResults = isOpen && Boolean(normalizedQuery);

  const handleClose = useCallback(() => {
    clearSearch();
    onClose();
  }, [clearSearch, onClose]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!normalizedQuery) return;

      handleClose();

      router.push(`/products?search=${encodeURIComponent(normalizedQuery)}`);
    },
    [normalizedQuery, router, handleClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <div ref={containerRef} className="relative flex h-11 items-center">
      {/* =========================================================
          COLLAPSED SEARCH BUTTON
      ========================================================== */}

      <div
        className={cn(
          'relative h-11 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'w-64 sm:w-80 md:w-96' : 'w-11'
        )}
      >
        {!isOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open search"
            className={cn(
              'group flex h-11 w-11 items-center justify-center',
              'rounded-full',
              'border border-transparent',
              'text-[var(--text-secondary)]',
              'transition-all duration-200',
              'hover:border-[var(--border)]',
              'hover:bg-[var(--surface-muted)]',
              'hover:text-[var(--text-primary)]',
              'focus-visible:outline-none'
            )}
          >
            <Search
              size={19}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ) : (
          <div className="relative w-full animate-in fade-in duration-200">
            {/* =====================================================
                SEARCH INPUT
            ====================================================== */}

            <form
              onSubmit={handleSubmit}
              className={cn(
                'group flex h-11 w-full items-center',
                'rounded-full',
                'border bg-[var(--surface)]',
                'px-2',
                'shadow-sm',
                'transition-all duration-200',

                'border-[var(--border-strong)]',

                'focus-within:border-[var(--accent)]',
                'focus-within:shadow-md'
              )}
            >
              {/* Search icon container */}

              <div
                className={cn(
                  'ml-0.5 flex h-8 w-8 shrink-0',
                  'items-center justify-center',
                  'rounded-full',
                  'bg-[var(--surface-muted)]',
                  'text-[var(--text-muted)]',
                  'transition-colors',
                  'group-focus-within:text-[var(--accent)]'
                )}
              >
                <Search size={15} strokeWidth={2.2} />
              </div>

              {/* Input */}

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                aria-label="Search"
                autoComplete="off"
                className={cn(
                  'min-w-0 flex-1',
                  'bg-transparent',
                  'px-2.5',
                  'text-sm font-medium',
                  'text-[var(--text-primary)]',
                  'placeholder:text-[var(--text-muted)]',
                  'outline-none',
                  'ring-0',
                  'focus:outline-none',
                  'focus:ring-0',
                  'focus-visible:outline-none',
                  'focus-visible:ring-0'
                )}
              />

              {/* Actions */}

              <div className="flex shrink-0 items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    title="Clear search"
                    className={cn(
                      'flex h-7 w-7 items-center justify-center',
                      'rounded-full',
                      'text-[var(--text-muted)]',
                      'transition-all duration-150',
                      'hover:bg-[var(--surface-muted)]',
                      'hover:text-[var(--text-primary)]'
                    )}
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                )}

                {/* ESC */}

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close search"
                  title="Close search"
                  className={cn(
                    'mr-0.5 flex h-7 w-7 items-center justify-center',
                    'rounded-full',
                    'text-[var(--text-muted)]',
                    'transition-all duration-150',
                    'hover:bg-[var(--surface-muted)]',
                    'hover:text-[var(--text-primary)]',
                    'focus:outline-none',
                    'focus:ring-0'
                  )}
                >
                  <X size={15} strokeWidth={2} />
                </button>
              </div>
            </form>

            {/* =====================================================
                SEARCH RESULTS
            ====================================================== */}

            {showResults && (
              <div
                className={cn(
                  'absolute left-0 right-0 top-[calc(100%+8px)] z-50',
                  'overflow-hidden',
                  'rounded-2xl',
                  'border border-[var(--border)]',
                  'bg-[var(--surface)]',
                  'shadow-xl',
                  'animate-in fade-in slide-in-from-top-2 duration-200'
                )}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center px-5 py-9 text-center">
                    <div
                      className={cn(
                        'mb-3 flex h-9 w-9 items-center justify-center',
                        'rounded-full',
                        'bg-[var(--surface-muted)]'
                      )}
                    >
                      <Loader2
                        size={17}
                        className="animate-spin text-[var(--accent)]"
                      />
                    </div>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Searching...
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Finding products and categories
                    </p>
                  </div>
                ) : error ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Search unavailable
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Please try again in a moment.
                    </p>
                  </div>
                ) : !hasResults ? (
                  <div className="px-5 py-8 text-center">
                    <div
                      className={cn(
                        'mx-auto mb-3 flex h-10 w-10',
                        'items-center justify-center',
                        'rounded-full',
                        'bg-[var(--surface-muted)]',
                        'text-[var(--text-muted)]'
                      )}
                    >
                      <Search size={17} />
                    </div>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      No results found
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Try searching for something else.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto p-2">
                    {/* PRODUCTS */}

                    {products.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 px-2 pb-1.5 pt-1">
                          <ShoppingBag
                            size={12}
                            className="text-[var(--text-muted)]"
                          />

                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            Products
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={handleClose}
                              className={cn(
                                'group flex items-center gap-3',
                                'rounded-xl',
                                'px-2.5 py-2.5',
                                'transition-all duration-150',
                                'hover:bg-[var(--surface-muted)]'
                              )}
                            >
                              <div
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center',
                                  'rounded-lg',
                                  'border border-[var(--border)]',
                                  'bg-[var(--surface-muted)]',
                                  'text-[var(--text-muted)]',
                                  'transition-colors',
                                  'group-hover:border-[var(--accent)]',
                                  'group-hover:text-[var(--accent)]'
                                )}
                              >
                                <ShoppingBag size={15} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    'truncate text-sm font-medium',
                                    'text-[var(--text-primary)]',
                                    'transition-colors',
                                    'group-hover:text-[var(--accent)]'
                                  )}
                                >
                                  {product.name}
                                </p>

                                {product.shortDescription && (
                                  <p className="mt-0.5 truncate text-[11px] text-[var(--text-secondary)]">
                                    {product.shortDescription}
                                  </p>
                                )}
                              </div>

                              <div
                                className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center',
                                  'rounded-full',
                                  'text-[var(--text-muted)]',
                                  'transition-all',
                                  'group-hover:bg-[var(--accent)]',
                                  'group-hover:text-[var(--surface)]'
                                )}
                              >
                                <ArrowUpRight size={13} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* CATEGORY */}

                    {categories.length > 0 && (
                      <section
                        className={cn(
                          products.length > 0
                            ? 'mt-2 border-t border-[var(--border)] pt-2'
                            : ''
                        )}
                      >
                        <div className="flex items-center gap-2 px-2 pb-1.5 pt-1">
                          <Tag size={12} className="text-[var(--text-muted)]" />

                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            Categories
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              onClick={handleClose}
                              className={cn(
                                'group flex items-center gap-3',
                                'rounded-xl',
                                'px-2.5 py-2.5',
                                'transition-all duration-150',
                                'hover:bg-[var(--surface-muted)]'
                              )}
                            >
                              <div
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center',
                                  'rounded-lg',
                                  'border border-[var(--border)]',
                                  'bg-[var(--surface-muted)]',
                                  'text-[var(--text-muted)]',
                                  'transition-colors',
                                  'group-hover:border-[var(--accent)]',
                                  'group-hover:text-[var(--accent)]'
                                )}
                              >
                                <Tag size={15} />
                              </div>

                              <span
                                className={cn(
                                  'min-w-0 flex-1 truncate',
                                  'text-sm font-medium',
                                  'text-[var(--text-primary)]',
                                  'transition-colors',
                                  'group-hover:text-[var(--accent)]'
                                )}
                              >
                                {category.name}
                              </span>

                              <div
                                className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center',
                                  'rounded-full',
                                  'text-[var(--text-muted)]',
                                  'transition-all',
                                  'group-hover:bg-[var(--accent)]',
                                  'group-hover:text-[var(--surface)]'
                                )}
                              >
                                <ArrowUpRight size={13} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
