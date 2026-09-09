import { Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductThumbnail } from './ProductThumbnail';
import { StatusBadge } from '../StatusBadge';
import { ProductActionMenu } from './ProductActionMenu';

export function ProductTableRow({
  product,
  onEdit,
  onDelete
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="group border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-muted)]/35">
      <td className="px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <ProductThumbnail product={product} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text-primary)]">
              {product.name}
            </p>

            <p className="mt-0.5 max-w-[270px] truncate text-xs text-[var(--text-muted)]">
              /{product.slug}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-[var(--surface-muted)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          {product.categoryName}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          {product.originalPrice ? (
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </p>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4  text-center">
        {product.rating !== null ? (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[var(--text-muted)]">★</span>
            <span className="text-[10px] text-[var(--text-muted)]">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">No rating</span>
        )}
      </td>

      <td className="px-4 py-4  text-center">
        <StatusBadge published={product.isPublished} />
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-center items-center gap-1.5">
          {product.isFeatured ? (
            <span
              title="Featured"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"
            >
              <Sparkles size={14} />
            </span>
          ) : null}

          {product.isTrending ? (
            <span
              title="Trending"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400"
            >
              <TrendingUp size={14} />
            </span>
          ) : null}

          {!product.isFeatured && !product.isTrending ? (
            <span className="text-xs text-center text-[var(--text-muted)]">
              —
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 flex justify-center">
        <ProductActionMenu onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}
