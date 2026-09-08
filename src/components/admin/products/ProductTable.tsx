'use client';

import { Edit2, Trash2, Sparkles, Flame, Star, Package } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete
}: ProductTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/30 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="py-3 pl-4 pr-3">Product</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Price</th>
            <th className="px-3 py-3">Rating</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Spotlight</th>
            <th className="py-3 pl-3 pr-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {products.map((product) => (
            <tr
              key={product.id}
              className="group transition-colors hover:bg-[var(--surface-muted)]/20"
            >
              {/* Product Info */}
              <td className="py-3 pl-4 pr-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>
                  <div className="max-w-[220px] lg:max-w-[300px]">
                    <div className="truncate font-bold text-[var(--text-primary)]">
                      {product.name}
                    </div>
                    <div className="truncate text-[11px] font-mono text-[var(--text-muted)]">
                      /{product.slug}
                    </div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-3 py-3 font-semibold text-[var(--text-secondary)]">
                {product.categoryName}
              </td>

              {/* Price */}
              <td className="px-3 py-3">
                <div className="font-bold text-[var(--text-primary)]">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
                {product.originalPrice && (
                  <div className="text-[10px] text-[var(--text-muted)] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </td>

              {/* Rating */}
              <td className="px-3 py-3">
                {product.rating ? (
                  <div className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      ({product.reviewCount})
                    </span>
                  </div>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </td>

              {/* Status */}
              <td className="px-3 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    product.isPublished
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      product.isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  {product.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>

              {/* Spotlight */}
              <td className="px-3 py-3">
                <div className="flex items-center gap-1.5">
                  {product.isFeatured && (
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"
                      title="Featured"
                    >
                      <Sparkles size={12} />
                    </span>
                  )}
                  {product.isTrending && (
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400"
                      title="Trending"
                    >
                      <Flame size={12} />
                    </span>
                  )}
                  {!product.isFeatured && !product.isTrending && (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="py-3 pl-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
