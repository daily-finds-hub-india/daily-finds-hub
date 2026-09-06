import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn('py-10 sm:py-12 lg:py-16', className)} {...props}>
      {children}
    </section>
  );
}
