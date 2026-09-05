import Link from 'next/link';

import { cn } from '@/lib/utils';

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-3 focus-visible:outline-none',
        className
      )}
      aria-label="Daily Finds Hub home"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md dark:bg-slate-800 dark:border dark:border-slate-700">
        <span className="font-extrabold text-sm tracking-tight text-white">
          DF
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75 duration-1000" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--accent)]" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="block text-base font-extrabold leading-none tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
            Daily Finds
          </span>
          <span className="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
            Hub
          </span>
        </div>
        {!compact && (
          <span className="mt-1 block text-[11px] font-medium tracking-normal text-[var(--text-muted)]">
            Curated Amazon India Finds
          </span>
        )}
      </div>
    </Link>
  );
}
