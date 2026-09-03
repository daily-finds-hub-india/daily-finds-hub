import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'group inline-flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',

        variant === 'primary' &&
          'rounded-[var(--radius-md)] bg-[var(--text-primary)] px-5 py-3 text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent)]',

        variant === 'secondary' &&
          'rounded-[var(--radius-md)] border border-[var(--border-strong)] px-5 py-3 text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-[var(--text-primary)]',

        variant === 'text' &&
          'border-b border-current pb-0.5 text-[var(--text-secondary)] hover:text-[var(--accent)]',

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
