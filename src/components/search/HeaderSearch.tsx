'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import {
  ArrowUpRight,
  Search,
  X,
  Loader2,
  Tag,
  ShoppingBag
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
  const isDropdownVisible = isOpen && Boolean(normalizedQuery);

  const handleClose = useCallback(() => {
    clearSearch();
    onClose();
  }, [clearSearch, onClose]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!normalizedQuery) return;

      router.push(`/products?search=${encodeURIComponent(normalizedQuery)}`);
    },
    [normalizedQuery, router]
  );

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

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
    <div ref={containerRef} className="relative flex items-center">
      <div
        className={cn(
          'relative transition-all duration-300 ease-out',
          isOpen ? 'w-64 sm:w-80 md:w-96' : 'w-10'
        )}
      >
        {!isOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        ) : (
          <div className="group/search relative w-full">
            {/* Unified Top Form */}
            <form
              onSubmit={handleSubmit}
              className={cn(
                'flex h-11 w-full items-center bg-[var(--surface)] px-3.5 transition-all',
                'border border-[var(--border-strong)] group-focus-within/search:border-[var(--accent)]',
                isDropdownVisible
                  ? 'rounded-t-2xl rounded-b-none border-b-transparent shadow-none'
                  : 'rounded-full shadow-xs'
              )}
            >
              <Search
                size={16}
                strokeWidth={2}
                className="mr-2.5 shrink-0 text-[var(--text-muted)] transition-colors group-focus-within/search:text-[var(--accent)]"
              />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gadgets, kitchen & home..."
                aria-label="Search"
                autoComplete="off"
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  background: 'transparent'
                }}
                className="w-full text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />

              {/* Action Buttons: Clear Query & Close Search */}
              <div className="flex items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear query text"
                    title="Clear text"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close search"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </form>

            {/* Attached Dropdown Body */}
            {isDropdownVisible && (
              <div
                className={cn(
                  'absolute left-0 right-0 top-full z-50 overflow-hidden',
                  'rounded-b-2xl border border-t-0 bg-[var(--surface)] shadow-2xl',
                  'border-[var(--border-strong)] group-focus-within/search:border-[var(--accent)]'
                )}
              >
                {/* Connecting Divider Line */}
                <div className="mx-3.5 border-t border-[var(--border)]" />

                {isLoading ? (
                  <div className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-[var(--text-secondary)]">
                    <Loader2
                      size={16}
                      className="animate-spin text-[var(--accent)]"
                    />
                    <span>Searching for &quot;{query}&quot;...</span>
                  </div>
                ) : error ? (
                  <div className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">
                    Search is currently unavailable.
                  </div>
                ) : !hasResults ? (
                  <div className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">
                    No results found for &quot;{query}&quot;.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)] py-1">
                    {products.length > 0 && (
                      <div className="p-1.5">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          <ShoppingBag size={12} />
                          <span>Products</span>
                        </div>
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={handleClose}
                            className="group/item flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-muted)]"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="truncate font-medium text-[var(--text-primary)] group-hover/item:text-[var(--accent)]">
                                {product.name}
                              </p>
                              {product.shortDescription && (
                                <p className="truncate text-xs text-[var(--text-secondary)]">
                                  {product.shortDescription}
                                </p>
                              )}
                            </div>
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-[var(--text-muted)] transition-transform group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-[var(--accent)]"
                            />
                          </Link>
                        ))}
                      </div>
                    )}

                    {categories.length > 0 && (
                      <div className="p-1.5">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          <Tag size={12} />
                          <span>Categories</span>
                        </div>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            onClick={handleClose}
                            className="group/item flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-muted)]"
                          >
                            <span className="truncate font-medium text-[var(--text-primary)] group-hover/item:text-[var(--accent)]">
                              {category.name}
                            </span>
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-[var(--text-muted)] transition-transform group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-[var(--accent)]"
                            />
                          </Link>
                        ))}
                      </div>
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
