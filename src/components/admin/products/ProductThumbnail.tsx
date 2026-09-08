import Image from 'next/image';
import { Package } from 'lucide-react';
import { Product } from '@/types/product';

export function ProductThumbnail({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <Image
        src={product.imageUrl}
        alt={product.name || 'Product image'}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-xl border border-[var(--border)] object-cover"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
      <Package size={18} strokeWidth={1.7} />
    </div>
  );
}
