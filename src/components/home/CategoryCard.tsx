import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block min-h-[220px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[var(--border-strong)] sm:min-h-[260px]"
    >
      <div className="absolute inset-0 bg-[var(--surface-muted)]">
        <div className="absolute right-[-12%] top-[12%] h-44 w-44 rounded-full border border-[var(--border-strong)] transition-transform duration-500 group-hover:scale-110 sm:h-52 sm:w-52" />

        <div className="absolute right-[12%] top-[24%] h-28 w-28 rotate-12 border border-[var(--border)] bg-[var(--surface)] transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-105 sm:h-36 sm:w-36" />
      </div>

      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5 sm:min-h-[260px] sm:p-6">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {category.id}
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
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
