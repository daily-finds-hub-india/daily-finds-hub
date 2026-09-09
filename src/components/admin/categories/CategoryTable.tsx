import { Category } from '@/types/category';
import { CategoryTableRow } from './CategoryTableRow';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete
}: CategoryTableProps) {
  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/30 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th scope="col" className="px-5 py-3.5">
              Category
            </th>
            <th scope="col" className="px-4 py-3.5">
              Products
            </th>
            <th scope="col" className="px-4 py-3.5">
              Status
            </th>
            <th scope="col" className="px-4 py-3.5">
              Spotlight
            </th>
            <th scope="col" className="px-5 py-3.5 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {categories.map((category) => (
            <CategoryTableRow
              key={category.id}
              category={category}
              onEdit={() => onEdit(category)}
              onDelete={() => onDelete(category)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
