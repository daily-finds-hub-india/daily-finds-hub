'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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

export function HeroSearch() {
  const router = useRouter();
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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const hasResults = products.length > 0 || categories.length > 0;
  const isDropdownOpen = isFocused && Boolean(normalizedQuery);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!normalizedQuery) return;

      setIsFocused(false);
      inputRef.current?.blur();
      router.push(`/products?search=${encodeURIComponent(normalizedQuery)}`);
    },
    [normalizedQuery, router]
  );

  const handleClear = useCallback(() => {
    clearSearch();
    inputRef.current?.focus();
  }, [clearSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Form Container */}
      <form
        onSubmit={handleSubmit}
        action="/products"
        method="GET"
        className={cn(
          'relative flex min-h-14 w-full items-center bg-[var(--surface)] transition-all duration-200',
          'overflow-hidden', // Fixes child elements overflowing rounded corners
          'border border-[var(--border-strong)]',
          isFocused && 'border-[var(--accent)]',
          isDropdownOpen
            ? 'rounded-t-2xl rounded-b-none border-b-transparent shadow-none'
            : 'rounded-2xl shadow-[var(--shadow-card)]'
        )}
      >
        <Search
          size={19}
          strokeWidth={1.8}
          className={cn(
            'pointer-events-none absolute left-4 shrink-0 transition-colors duration-200 sm:left-5',
            isFocused ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
          )}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="search"
          name="search"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for gadgets, home finds, tech..."
          aria-label="Search products"
          autoComplete="off"
          className={cn(
            'min-h-14 w-full border-0 bg-transparent py-3.5 pl-11 pr-28 text-sm font-medium text-[var(--text-primary)] sm:pl-12 sm:pr-36 sm:text-base',
            'outline-none focus:outline-none focus:ring-0 placeholder:text-[var(--text-muted)]',
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none' // Removes default browser 'x' icon
          )}
        />

        <div className="absolute right-2 flex items-center gap-1.5 sm:right-2.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          )}

          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--accent)] px-3.5 text-xs font-bold text-slate-950 shadow-xs transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[var(--accent-hover)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] sm:px-5 sm:text-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Seamless Recommendations Container */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute left-0 right-0 top-full z-40 overflow-hidden bg-[var(--surface)]',
              'rounded-b-2xl border border-t-0 shadow-xl',
              'border-[var(--border-strong)]',
              isFocused && 'border-[var(--accent)]'
            )}
          >
            <div className="mx-4 border-t border-[var(--border)]" />

            <div className="max-h-[min(55vh,28rem)] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center gap-3 px-3 py-4">
                  <Loader2
                    size={18}
                    className="shrink-0 animate-spin text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    Searching for &quot;{query}&quot;...
                  </p>
                </div>
              ) : error ? (
                <div className="px-3 py-4 text-xs text-[var(--text-secondary)]">
                  Search unavailable right now.
                </div>
              ) : !hasResults ? (
                <div className="px-3 py-4 text-xs text-[var(--text-secondary)]">
                  No finds matched &quot;{query}&quot;.
                </div>
              ) : (
                <>
                  {products.length > 0 && (
                    <section>
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <ShoppingBag
                          size={12}
                          className="text-[var(--text-muted)]"
                        />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Products
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => setIsFocused(false)}
                            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                          >
                            <span className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                              {product.name}
                            </span>
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-[var(--text-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                            />
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  {categories.length > 0 && (
                    <section
                      className={cn(
                        products.length > 0 &&
                          'mt-2 border-t border-[var(--border)] pt-2'
                      )}
                    >
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <Tag size={12} className="text-[var(--text-muted)]" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Categories
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            onClick={() => setIsFocused(false)}
                            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                          >
                            <span className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                              {category.name}
                            </span>
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-[var(--text-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                            />
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
