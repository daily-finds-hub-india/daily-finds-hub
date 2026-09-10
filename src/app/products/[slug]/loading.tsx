'use client';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/ui/Section';

export default function ProductDetailsLoading() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-16">
            <div className="min-w-0 lg:col-span-6">
              <div className="aspect-square w-full animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] sm:rounded-3xl" />
              <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 sm:mt-4 sm:gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square w-16 shrink-0 animate-pulse rounded-lg bg-[var(--surface-muted)] sm:w-20 sm:rounded-xl"
                  />
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center lg:col-span-6">
              <div className="mb-4 h-4 w-32 animate-pulse rounded bg-[var(--surface-muted)] sm:mb-5" />
              <div className="space-y-2">
                <div className="h-8 w-4/5 animate-pulse rounded-lg bg-[var(--surface-muted)] sm:h-10" />
                <div className="h-8 w-3/5 animate-pulse rounded-lg bg-[var(--surface-muted)] sm:h-10" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
              </div>
              <div className="mt-4 h-5 w-36 animate-pulse rounded bg-[var(--surface-muted)]" />
              <div className="mt-5 h-20 w-full animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] sm:mt-6" />
              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <div className="h-3 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--surface-muted)]" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-[var(--surface-muted)]" />
                </div>
              </div>
              <div className="mt-7 sm:mt-8">
                <div className="h-14 w-full animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
