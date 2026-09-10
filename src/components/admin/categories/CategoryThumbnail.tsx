import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Category } from '@/types/category';

export function CategoryThumbnail({ category }: { category: Category }) {
  const primaryImage =
    category.images?.find((img) => img.isPrimary) || category.images?.[0];

  if (!primaryImage) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
        <ImageIcon size={18} />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)]">
      <Image
        src={primaryImage.url}
        alt={primaryImage.altText || category.name}
        fill
        className="object-cover"
        sizes="40px"
      />
    </div>
  );
}
