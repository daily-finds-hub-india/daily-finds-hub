import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      <Container className="flex min-h-[calc(100vh-4.5rem)] items-center py-20">
        <div className="w-full max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            404 — Not found
          </p>

          <h1 className="mt-5 max-w-2xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--text-primary)]">
            Looks like this find got away.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s
            get you back to something worth discovering.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Back home
            </Link>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
      </Container>
    </main>
  );
}
