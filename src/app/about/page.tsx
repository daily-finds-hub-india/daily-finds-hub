import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About',
  description:
    'Learn more about Daily Finds Hub India and what we look for when discovering products.'
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story & Vision"
        title="Useful things are worth finding."
        description="Daily Finds Hub is a curated discovery platform built for people who want clever gadgets, thoughtful home products, and practical finds without wading through marketplace clutter."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent-text)]">
                Our Mission
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Curation over endless algorithms.
              </h2>
            </div>

            <div className="space-y-6 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              <p>
                Every day, thousands of new products flood online marketplaces. Many are clones or gimmick-heavy gadgets that break in a week. But tucked away are genuinely clever tools—products that solve an annoying daily friction, organize a messy desk, or simplify cooking dinner.
              </p>
              <p>
                At <strong>Daily Finds Hub</strong>, we track down those standout finds, test their utility, and curate them in one clean, uncluttered catalog. When you see something you love on our social reels or browse here, we provide direct, honest Amazon India links so you can check live prices and purchase safely.
              </p>
            </div>
          </div>

          {/* Three Pillars Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)]">
                <CheckCircle2 size={24} strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
                100% Useful
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Every product must solve a real problem, save time, or deliver genuine everyday utility.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)]">
                <Sparkles size={24} strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
                Clever & Curious
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                We hunt for unique finds that make you pause and say, &ldquo;I didn&apos;t know this existed, but I need it.&rdquo;
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)]">
                <ShieldCheck size={24} strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
                Transparent & Direct
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                No deceptive pricing or fake reviews. We link directly to verified Amazon listings with full affiliate disclosure.
              </p>
            </div>
          </div>

          {/* Social CTA Row */}
          <div className="mt-16 rounded-3xl border border-[var(--border-strong)] bg-[var(--surface)] p-8 sm:p-12 shadow-[var(--shadow-raised)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Ready to explore today&apos;s discoveries?
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Browse our full collection or check out what is trending on our reels right now.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-slate-950 shadow-xs transition-all hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Explore All Finds</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
