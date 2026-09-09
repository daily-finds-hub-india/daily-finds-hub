import { getAdminCategoriesList } from '@/lib/services/admin-category.server';
import { CategoriesClientView } from '@/components/admin/categories/CategoriesClientView';

export const revalidate = 0;

export default async function CategoriesPage() {
  const initialCategories = await getAdminCategoriesList();

  return <CategoriesClientView initialCategories={initialCategories} />;
}
