import { Package, Sparkles } from 'lucide-react';
import { Category } from '@/types/category';
import { StatusBadge } from '../StatusBadge';
import { CategoryThumbnail } from './CategoryThumbnail';
import { CategoryActionMenu } from './CategoryActionMenu';

export function CategoryTableRow({
  category,
  onEdit,
  onDelete
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="group border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-muted)]/35">
      {/* 1. Category Name & Slug */}
      <td className="px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <CategoryThumbnail category={category} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text-primary)]">
              {category.name}
            </p>

            <p className="mt-0.5 max-w-[270px] truncate text-xs text-[var(--text-muted)]">
              /{category.slug}
            </p>
          </div>
        </div>
      </td>

      {/* 2. Product Count Badge */}
      <td className="px-4 py-3">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-muted)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          <Package size={13} className="text-[var(--text-muted)]" />
          <span>{category.productCount}</span>
        </div>
      </td>

      {/* 3. Published Status */}
      <td className="px-4 py-3">
        <StatusBadge published={category.isPublished} />
      </td>

      {/* 4. Badges (Featured) */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {category.isFeatured ? (
            <span
              title="Featured"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"
            >
              <Sparkles size={14} />
            </span>
          ) : (
            <span className="text-xs text-center text-[var(--text-muted)]">
              —
            </span>
          )}
        </div>
      </td>

      {/* 5. Action Menu */}
      <td className="px-4 py-3 text-right">
        <CategoryActionMenu onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}
