'use client';
import { Container } from '@/components/layout/Container';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { Section } from '@/components/ui/Section';

export default function CategoryDetailLoading() {
  return (
    <main>
      <Section>
        <Container>
          <div className="mb-8 h-4 w-28 animate-pulse rounded bg-[var(--surface-muted)]" />

          <div className="max-w-2xl space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />
            <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
            <div className="h-5 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
          </div>

          <div className="mt-12">
            <ProductGridSkeleton />
          </div>
        </Container>
      </Section>
    </main>
  );
}
