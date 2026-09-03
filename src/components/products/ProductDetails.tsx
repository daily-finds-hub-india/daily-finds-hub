import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';

import type { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
      {/* Product visual */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[48%] w-[48%] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(0,0,0,0.12)]" />
          </div>
        )}

        {product.trending && (
          <span className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Trending
          </span>
        )}
      </div>

      {/* Product information */}
      <div className="flex flex-col justify-center">
        <Link
          href="/products"
          className="group mb-8 inline-flex w-fit items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to finds
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {product.category}
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
          {product.name}
        </h1>

        <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
          {product.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[var(--border)] py-5">
          {product.price && (
            <span className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              ₹{product.price.amount.toLocaleString('en-IN')}
            </span>
          )}

          {product.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star size={15} fill="currentColor" strokeWidth={1.5} />

              <span className="font-medium text-[var(--text-primary)]">
                {product.rating}
              </span>

              {product.reviewCount && (
                <span className="text-[var(--text-muted)]">
                  ({product.reviewCount.toLocaleString('en-IN')})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          {product.amazonUrl ? (
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group inline-flex items-center gap-3 bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--background)] transition-colors duration-200 hover:bg-[var(--accent)]"
            >
              View on Amazon
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Amazon link will be added when this product is published.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
