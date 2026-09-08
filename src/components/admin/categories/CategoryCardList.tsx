import { Package, Sparkles } from 'lucide-react';
import { Category } from '@/types/category';
import { StatusBadge } from '../StatusBadge';
import { CategoryThumbnail } from './CategoryThumbnail';
import { CategoryActionMenu } from './CategoryActionMenu';

interface CategoryCardListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCardList({
  categories,
  onEdit,
  onDelete
}: CategoryCardListProps) {
  return (
    <div className="divide-y divide-[var(--border)] md:hidden">
      {categories.map((category) => (
        <div
          key={category.id}
          className="p-4 transition-colors hover:bg-[var(--surface-muted)]/20"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CategoryThumbnail category={category} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-[var(--text-primary)]">
                    {category.name}
                  </h3>
                  {category.isFeatured ? (
                    <Sparkles
                      size={13}
                      className="shrink-0 text-[var(--accent)]"
                    />
                  ) : null}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  /{category.slug}
                </p>
              </div>
            </div>
            <StatusBadge published={category.isPublished} />
          </div>

          <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-[var(--border)]/50">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              <Package size={14} className="text-[var(--text-muted)]" />
              <span>{category.productCount} Products</span>
            </div>

            <CategoryActionMenu
              onEdit={() => onEdit(category)}
              onDelete={() => onDelete(category)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
