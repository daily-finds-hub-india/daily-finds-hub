import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1/2 w-1/2 border border-[var(--border-strong)] bg-[var(--surface)] transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}

          {product.trending && (
            <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Trending
            </span>
          )}

          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] opacity-0 shadow-[var(--shadow-subtle)] transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </span>
        </div>

        <div className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-medium leading-6 tracking-[-0.02em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                {product.name}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                {product.description}
              </p>
            </div>

            {product.price && (
              <span className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
                ₹{product.price.amount.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
