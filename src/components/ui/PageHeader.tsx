import type { HTMLAttributes } from 'react';

import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        'border-b border-[var(--border)]',
        'bg-[var(--surface)]',
        'pb-10 pt-10',
        'sm:pb-12 sm:pt-12',
        'lg:pb-14 lg:pt-14',
        className
      )}
      {...props}
    >
      {/* Decorative background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl sm:-right-16 sm:-top-28 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="page-header-fade-up inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)] sm:text-xs">
              {eyebrow}
            </div>
          )}

          <h1
            className={cn(
              'page-header-fade-up',
              eyebrow ? 'mt-4' : 'mt-0',
              'text-3xl font-extrabold tracking-[-0.03em]',
              'leading-[1.08]',
              'text-[var(--text-primary)]',
              'sm:text-5xl',
              'lg:text-6xl'
            )}
            style={{
              animationDelay: '70ms'
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              className="page-header-fade-up mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-7 lg:text-lg"
              style={{
                animationDelay: '140ms'
              }}
            >
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
