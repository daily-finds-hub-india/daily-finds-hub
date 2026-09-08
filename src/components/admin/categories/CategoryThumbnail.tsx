import Image from 'next/image';
import { Package } from 'lucide-react';
import { Category } from '@/types/category';

export function CategoryThumbnail({ category }: { category: Category }) {
  if (category.imageUrl) {
    return (
      <Image
        src={category.imageUrl}
        alt={category.name}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-xl border border-[var(--border)] object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
      <Package size={18} strokeWidth={1.8} />
    </div>
  );
}
