import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { HeroSearch } from '@/components/search/HeroSearch';

const popularCategories = [
  { label: 'Tech Gadgets', query: 'tech' },
  { label: 'Kitchen Finds', query: 'kitchen' },
  { label: 'Home Living', query: 'home' },
  { label: 'Travel Essentials', query: 'travel' }
];

const trustPoints = [
  'Carefully curated',
  'Useful over gimmicky',
  'Direct Amazon links'
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] pb-12 pt-10 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16 xl:pb-24 xl:pt-[4.5rem]">
      <div
        className="pointer-events-none absolute -top-32 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-[var(--accent)]/10 blur-3xl sm:right-[-4rem] lg:h-[38rem] lg:w-[38rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/5 blur-3xl lg:h-[32rem] lg:w-[32rem]"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <div className="hero-fade-up inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)] shadow-xs sm:px-3.5 sm:text-xs">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] motion-safe:animate-pulse sm:h-2 sm:w-2"
                aria-hidden="true"
              />

              <span className="truncate">
                Useful finds, thoughtfully curated
              </span>
            </div>

            <h1 className="hero-fade-up hero-delay-1 mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:mt-6 sm:text-5xl lg:text-5xl xl:text-6xl">
              Find things you&apos;ll{' '}
              <span className="relative inline-block text-[var(--accent)]">
                actually want.
              </span>
            </h1>

            <p className="hero-fade-up hero-delay-2 mt-5 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:mt-6 sm:text-base lg:text-base lg:leading-7 xl:text-lg">
              Skip the clutter. Discover clever home goods, practical tech,
              travel gear, and everyday tools worth knowing about.
            </p>

            <div className="hero-fade-up hero-delay-3 mt-7 w-full max-w-xl sm:mt-8">
              {/* <form
                action="/products"
                method="GET"
                className="relative flex w-full items-center"
              >
                <Search
                  size={19}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 shrink-0 text-[var(--text-muted)] sm:left-5"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  name="search"
                  placeholder="Search for gadgets, home finds, tech..."
                  aria-label="Search products"
                  autoComplete="off"
                  className="min-h-14 w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] py-3.5 pl-11 pr-24 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 sm:pl-12 sm:pr-32 sm:text-base"
                />

                <button
                  type="submit"
                  className="absolute right-2 inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--accent)] px-3.5 text-xs font-bold text-slate-950 shadow-xs transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[var(--accent-hover)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] sm:right-2.5 sm:px-5 sm:text-sm"
                >
                  Search
                </button>
              </form> */}
              <HeroSearch />

              <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-4">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] sm:text-xs">
                  Popular:
                </span>

                {popularCategories.map((category) => (
                  <Link
                    key={category.query}
                    href={`/products?search=${category.query}`}
                    className="inline-flex min-h-8 items-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold text-[var(--text-secondary)] transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hero-fade-up hero-delay-4 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-[var(--border)] pt-5 sm:mt-10 sm:gap-x-6 sm:pt-6">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] sm:gap-2 sm:text-xs"
                >
                  <CheckCircle2
                    size={14}
                    strokeWidth={2}
                    className="shrink-0 text-[var(--accent)] sm:h-[15px] sm:w-[15px]"
                    aria-hidden="true"
                  />

                  <span>{point}</span>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="hero-fade-up hero-delay-5 group mt-7 inline-flex min-h-10 w-fit items-center gap-2 text-xs font-bold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:hidden"
            >
              <span>Explore all finds</span>

              <ArrowRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="hero-visual relative min-w-0 lg:col-span-6">
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-[var(--accent)]/20 via-transparent to-blue-500/10 blur-2xl sm:-inset-6"
              aria-hidden="true"
            />

            <div className="group relative mx-auto aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--surface-muted)] shadow-2xl sm:aspect-[4/3] lg:max-w-none">
              <Image
                src="/images/hero/hero-image.png"
                alt="A curated collection of interesting everyday products"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
                aria-hidden="true"
              />

              <div className="hero-badge absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-2xl border border-white/20 bg-black/45 px-3 py-2.5 text-white shadow-lg backdrop-blur-md sm:left-4 sm:top-4 sm:gap-2.5 sm:px-3.5 sm:py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-slate-950 sm:h-9 sm:w-9">
                  <Compass
                    size={16}
                    strokeWidth={2.1}
                    className="sm:h-[17px] sm:w-[17px]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300 sm:text-[10px]">
                    Curated discovery
                  </p>

                  <p className="truncate text-[11px] font-extrabold sm:text-xs">
                    Things worth finding
                  </p>
                </div>
              </div>

              <div className="hero-badge absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-2xl border border-white/20 bg-black/50 p-2.5 text-white shadow-xl backdrop-blur-md sm:bottom-4 sm:right-4 sm:gap-3 sm:p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white sm:h-9 sm:w-9">
                  <Sparkles
                    size={16}
                    strokeWidth={2}
                    className="sm:h-[18px] sm:w-[18px]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold sm:text-xs">
                    Fresh discoveries
                  </p>

                  <p className="truncate text-[10px] text-slate-300 sm:text-[11px]">
                    New finds, added regularly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
