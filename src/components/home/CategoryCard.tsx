import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  images?: CategoryImage[];
  isFeatured?: boolean;
};

type CategoryImage = {
  url: string;
  isPrimary: boolean;
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const image =
    category.images?.find((item) => item.isPrimary) ?? category.images?.[0];
  const imageUrl = image?.url ?? category.image;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block min-h-[220px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[var(--border-strong)] sm:min-h-[260px]"
    >
      <div className="absolute inset-0 bg-[var(--surface-muted)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.92))]" />
      </div>

      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5 sm:min-h-[260px] sm:p-6">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {category.slug}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] opacity-70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100">
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
            {category.name}
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
            {category.description ?? 'Useful products worth discovering.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
