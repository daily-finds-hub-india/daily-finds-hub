import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/components/products/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

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
      <EmptyState
        eyebrow="Nothing here yet"
        title="No finds in this section."
        description={emptyMessage}
      />
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
