import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-[var(--border)]">
      <Container className="grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 sm:gap-12 sm:py-16 md:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-20 xl:py-20">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:mb-6">
            Discover something useful
          </p>

          <h1 className="text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[var(--text-primary)]">
            Better finds.
            <br />
            <span className="text-[var(--text-secondary)]">Every day.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:mt-8 sm:text-lg sm:leading-8">
            We discover clever gadgets, useful everyday products, and
            interesting things worth knowing about — so you don&apos;t have to
            search for them yourself.
          </p>

          <div className="mt-8 sm:mt-9">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border-b border-[var(--text-primary)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Explore finds
              <ArrowRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[420px] md:min-h-[460px] lg:min-h-[520px]">
          <div className="relative aspect-square w-[78%] max-w-[560px] overflow-hidden rounded-[1.25rem] bg-[var(--surface-muted)] sm:w-[82%] md:w-[88%] lg:w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[50%] w-[50%] rotate-[-7deg] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-[10%] border border-[var(--border)]" />

                <div className="absolute bottom-[10%] left-[10%]">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    DAILY FIND
                  </p>

                  <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-2xl">
                    Something
                    <br />
                    useful.
                  </p>
                </div>
              </div>
            </div>

            <span className="absolute left-5 top-5 text-xs font-medium text-[var(--text-muted)] sm:left-6 sm:top-6">
              01 / 01
            </span>

            <span className="absolute bottom-5 right-5 text-xs font-medium text-[var(--text-muted)] sm:bottom-6 sm:right-6">
              Worth discovering
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
