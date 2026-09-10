'use client';

import Image from 'next/image';
import { Edit2, Trash2, Sparkles, Flame, Star, Package } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCardList({
  products,
  onEdit,
  onDelete
}: ProductCardListProps) {
  return (
    <div className="divide-y divide-[var(--border)] md:hidden">
      {products.map((product) => (
        <div key={product.id} className="p-3.5 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <Package size={18} />
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  /{product.slug}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                product.isPublished
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {product.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-2.5">
            <div>
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">
                Category
              </span>
              <span className="font-semibold text-[var(--text-secondary)]">
                {product.categoryName}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">
                Price
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[var(--text-primary)]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-[var(--text-muted)] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">
                Rating
              </span>
              {product.rating ? (
                <div className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
              ) : (
                <span className="text-[var(--text-muted)]">—</span>
              )}
            </div>

            <div>
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">
                Spotlight
              </span>
              <div className="flex items-center gap-1">
                {product.isFeatured && (
                  <Sparkles size={12} className="text-amber-400" />
                )}
                {product.isTrending && (
                  <Flame size={12} className="text-rose-400" />
                )}
                {!product.isFeatured && !product.isTrending && (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            >
              <Edit2 size={13} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
