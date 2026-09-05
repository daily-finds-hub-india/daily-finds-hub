import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Container } from '@/components/layout/Container';

export function DiscoveryCta() {
  return (
    <section className="border-t border-[var(--border)] py-14 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] p-8 sm:p-12 lg:p-16 shadow-[var(--shadow-raised)]">
          {/* Subtle Accent Glow */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--accent)]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent-text)]">
                <Sparkles size={13} strokeWidth={2.2} />
                <span>Never Miss a Reel Find</span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
                There&apos;s always something worth finding.
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                From clever kitchen organizers to viral desk gadgets, discover verified products that make daily life simpler, smarter, and more enjoyable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xs transition-all duration-200 hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

