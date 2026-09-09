// src/components/admin/products/ProductTable.tsx
'use client';

import { Product } from '@/types/product';
import { ProductTableRow } from './ProductTableRow';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete
}: ProductTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/30 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="py-3 pl-4 pr-3">Product</th>
            <th className="px-3 py-3 text-center">Category</th>
            <th className="px-3 py-3 text-center">Price</th>
            <th className="px-3 py-3 text-center">Rating</th>
            <th className="px-3 py-3 text-center">Status</th>
            <th className="px-3 py-3 text-center">Spotlight</th>
            <th className="py-3 pl-3 pr-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onEdit={() => onEdit(product)}
              onDelete={() => onDelete(product)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
