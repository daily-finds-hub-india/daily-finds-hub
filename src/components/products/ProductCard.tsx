import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Flame, Sparkles, Star } from 'lucide-react';

import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  const price =
    product.price !== null && product.price !== undefined
      ? Number(product.price)
      : null;

  const originalPrice =
    product.originalPrice !== null && product.originalPrice !== undefined
      ? Number(product.originalPrice)
      : null;

  const hasDiscount =
    price !== null && originalPrice !== null && originalPrice > price;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]">
      {/* Product image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
        aria-label={`View ${product.name}`}
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]"
            aria-hidden="true"
          >
            <Sparkles size={28} strokeWidth={1.5} />
          </div>
        )}

        {/* Product badges */}
        {(product.isTrending || product.isFeatured) && (
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            {product.isTrending ? (
              <span className="inline-flex min-h-7 max-w-[calc(100%-4rem)] items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-slate-950 shadow-xs">
                <Flame size={12} strokeWidth={2.5} aria-hidden="true" />
                <span>Trending</span>
              </span>
            ) : (
              <span />
            )}

            {product.isFeatured && (
              <span className="inline-flex min-h-7 shrink-0 items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-md dark:bg-slate-800/90">
                <Sparkles size={11} strokeWidth={2} aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${product.slug}`}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)] sm:text-base">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          {product.rating !== null && product.rating !== undefined && (
            <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[var(--text-muted)]">
              <Star
                size={13}
                fill="currentColor"
                strokeWidth={1.5}
                className="shrink-0 text-[var(--accent)]"
                aria-hidden="true"
              />

              <span className="font-bold text-[var(--text-primary)]">
                {Number(product.rating).toFixed(1)}
              </span>

              {product.reviewCount !== null &&
                product.reviewCount !== undefined && (
                  <span className="truncate">
                    ({product.reviewCount.toLocaleString('en-IN')})
                  </span>
                )}
            </div>
          )}
        </div>

        {/* Price and action */}
        <div className="mt-4 flex min-w-0 items-end justify-between gap-2 border-t border-[var(--border)] pt-3.5">
          <div className="min-w-0 flex-1">
            {price !== null ? (
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
                  ₹{price.toLocaleString('en-IN')}
                </span>

                {hasDiscount && (
                  <span className="text-xs text-[var(--text-muted)] line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                See on Amazon
              </span>
            )}
          </div>

          {product.amazonUrl ? (
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-xl bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-xs transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-[var(--accent-hover)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
              aria-label={`Check price on Amazon for ${product.name}`}
            >
              <span>Amazon</span>

              <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden="true" />
            </a>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-xl bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
              aria-label={`View details for ${product.name}`}
            >
              <span>Details</span>

              <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
