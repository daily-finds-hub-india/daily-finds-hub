import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'touch-manipulation text-[var(--text-primary)]',
        'transition-colors duration-200',
        'hover:bg-[var(--surface-muted)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--accent)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background)]',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
