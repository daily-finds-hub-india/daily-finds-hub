import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100svh-4.5rem)]">
      <Container className="flex min-h-[calc(100svh-4.5rem)] items-center py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-text)] sm:text-xs">
            404 — Not found
          </p>

          <h1 className="mt-4 max-w-2xl text-[clamp(2.75rem,10vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.055em] text-[var(--text-primary)] sm:mt-5">
            Looks like this find got away.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:mt-7 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved. Let&apos;s get you back to something worth discovering.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              href="/products"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-slate-950 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--accent-hover)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <span>Explore finds</span>
              <Compass
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:rotate-45"
              />
            </Link>

            <Link
              href="/"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text-primary)] shadow-xs transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] hover:text-[var(--accent)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <ArrowLeft
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Back home</span>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
