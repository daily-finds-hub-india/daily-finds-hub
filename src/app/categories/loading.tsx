import { Container } from '@/components/layout/Container';
import { Section } from '@/components/ui/Section';

export default function CategoriesLoading() {
  return (
    <main>
      <Section>
        <Container>
          {/* Header Skeleton */}
          <div className="max-w-2xl space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />
            <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
            <div className="h-5 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <div className="space-y-3">
                  {/* Category icon/badge skeleton */}
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--surface-muted)]" />

                  {/* Category title skeleton */}
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--surface-muted)]" />

                  {/* Description skeleton */}
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
                </div>

                {/* Footer/count skeleton */}
                <div className="mt-6 h-4 w-24 animate-pulse rounded bg-[var(--surface-muted)]" />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
