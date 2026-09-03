import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products found.'
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border-t border-[var(--border)] py-16 text-center">
        <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
