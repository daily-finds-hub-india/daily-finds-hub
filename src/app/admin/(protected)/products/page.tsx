// src/app/admin/products/page.tsx
import { getAdminProductsData } from '@/lib/services/admin-product.server';
import { ProductsClientView } from '@/components/admin/products/ProductsClientView';

export const revalidate = 0;

export default async function ProductsPage() {
  const { products, categories } = await getAdminProductsData();

  return (
    <ProductsClientView initialProducts={products} categories={categories} />
  );
}
