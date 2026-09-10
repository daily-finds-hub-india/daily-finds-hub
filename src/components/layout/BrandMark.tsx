import Image from 'next/image';
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
        'group inline-flex min-w-0 shrink-0 items-center gap-2.5 focus-visible:outline-none',
        className
      )}
      aria-label="Daily Finds Hub home"
    >
      <Image
        src="/images/brand/Logo-2.svg"
        alt="Daily Finds Hub"
        width={45}
        height={45}
        priority
        sizes="45px"
        className="h-[45px] w-[45px] shrink-0 rounded-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
      />

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-base">
            Daily Finds
          </span>

          <span className="shrink-0 rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
            Hub
          </span>
        </div>

        {!compact && (
          <span className="mt-1 hidden text-[11px] font-medium text-[var(--text-muted)] sm:block">
            Curated Amazon India Finds
          </span>
        )}
      </div>
    </Link>
  );
}
