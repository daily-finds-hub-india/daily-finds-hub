import { CategoryCard } from '@/components/categories/CategoryCard';
import type { Category } from '@/types/category';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3',
        className
      )}
    >
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
