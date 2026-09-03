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
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'text-[var(--text-primary)]',
        'transition-all duration-200',
        'hover:bg-[var(--surface-muted)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--accent)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
