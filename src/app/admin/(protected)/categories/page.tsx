import { CategoryManager } from '@/components/admin/categories/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Management
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Categories
        </h1>

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Create, edit, and organize your product categories.
        </p>
      </div>

      <CategoryManager />
    </div>
  );
}
