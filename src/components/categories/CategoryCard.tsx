import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const image =
    category.images.find((item) => item.isPrimary) ?? category.images[0];

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block min-h-[220px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-raised)] sm:min-h-[260px]"
    >
      <div className="absolute inset-0 bg-slate-900">
        {image?.url ? (
          <Image
            src={image.url}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-[var(--text-muted)]">
            <Sparkles size={32} strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
        />
      </div>

      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:min-h-[260px]">
        <div className="flex items-start justify-between gap-3">
          <span className="max-w-[calc(100%-3rem)] truncate rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-xs backdrop-blur-md sm:text-[11px]">
            {category.name}
          </span>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/20 text-white shadow-xs backdrop-blur-md transition-[transform,background-color,border-color,color] duration-300 group-hover:scale-105 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-slate-950 sm:h-10 sm:w-10"
          >
            <ArrowUpRight
              size={17}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-extrabold tracking-[-0.025em] text-white transition-colors group-hover:text-amber-300 sm:text-2xl">
            {category.name}
          </h3>

          <p className="mt-1.5 line-clamp-2 max-w-xs text-xs leading-5 text-slate-200 sm:text-sm sm:leading-6">
            {category.description ?? 'Curated products worth discovering.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
