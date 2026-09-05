import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';

type CategoryImage = {
  url: string;
  isPrimary: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: CategoryImage[];
  isFeatured?: boolean;
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const image =
    category.images.find((item) => item.isPrimary) ?? category.images[0];

  const imageUrl = image?.url;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block min-h-[220px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-raised)] sm:min-h-[260px]"
    >
      <div className="absolute inset-0 bg-slate-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.url ? category.name : category.name}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-[var(--text-muted)]">
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:min-h-[260px]">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
            {category.name}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/20 text-white shadow-xs backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-slate-950">
            <ArrowUpRight size={17} strokeWidth={2.2} />
          </span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-amber-300 sm:text-2xl">
            {category.name}
          </h3>

          <p className="mt-1.5 line-clamp-2 max-w-xs text-xs text-slate-200 sm:text-sm">
            {category.description ?? 'Curated products worth discovering.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
