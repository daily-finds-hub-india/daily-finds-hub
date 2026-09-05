import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn('py-16 sm:py-20 lg:py-28', className)} {...props}>
      {children}
    </section>
  );
}
