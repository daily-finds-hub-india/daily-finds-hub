import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Search,
  Sparkles
} from 'lucide-react';

import { Container } from '@/components/layout/Container';

interface HeroProps {
  image?: {
    url: string;
    altText: string;
  };
  featuredProduct?: {
    name: string;
    slug: string;
    price: unknown;
    originalPrice?: unknown;
    rating?: unknown;
    reviewCount?: number;
    amazonUrl: string | null;
    shortDescription?: string;
  };
}

export function Hero({ image, featuredProduct }: HeroProps) {
  const imageUrl = image?.url;
  const imageAlt =
    image?.altText ?? featuredProduct?.name ?? 'Curated discovery';

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] py-10 sm:py-16 lg:py-20">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Social-to-Affiliate Bridge */}
        <div className="lg:col-span-7">
          {/* Eyebrow / Social Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-1 text-xs font-semibold text-[var(--text-secondary)] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>As Seen on Our Socials</span>
            <span className="text-[var(--border-strong)]">|</span>
            <span className="font-bold text-[var(--text-primary)]">
              Curated India Finds
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl sm:leading-[1.1]">
            Find the products you loved on our{' '}
            <span className="text-[var(--accent)]">Reels.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            A curated shortlist of useful tech gadgets, clever kitchen tools,
            and practical home finds. Honest utility, zero marketplace clutter,
            and direct Amazon India links.
          </p>

          {/* Social Find Search Bar */}
          <div className="mt-7 max-w-xl">
            <form
              action="/products"
              method="GET"
              className="relative flex w-full items-center"
            >
              <Search
                size={18}
                className="pointer-events-none absolute left-4 text-[var(--text-muted)]"
              />
              <input
                type="search"
                name="search"
                placeholder="Search a product you saw on our video..."
                aria-label="Search products"
                className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] py-3.5 pl-11 pr-28 text-sm font-medium text-[var(--text-primary)] shadow-sm outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-slate-950 shadow-xs transition-all duration-200 hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
              >
                Find Now
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Popular:
              </span>
              {[
                { label: 'Tech Gadgets', query: 'tech' },
                { label: 'Kitchen Finds', query: 'kitchen' },
                { label: 'Desk Setup', query: 'desk' },
                { label: 'Home Living', query: 'home' }
              ].map((tag) => (
                <Link
                  key={tag.query}
                  href={`/products?search=${tag.query}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust Value Props */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-[var(--accent)] shrink-0"
              />
              <span>100% Curated Picks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-[var(--accent)] shrink-0"
              />
              <span>Direct Amazon Outbound</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-[var(--accent)] shrink-0"
              />
              <span>Tested Utility</span>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Product Spotlight Card */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--surface)] p-3 shadow-[var(--shadow-raised)] transition-all duration-300 hover:shadow-2xl">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-[var(--text-muted)]">
                  <Sparkles size={40} strokeWidth={1.5} />
                </div>
              )}

              {/* Floating Badge Top */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md">
                <Flame size={13} className="text-[var(--accent)]" />
                <span>Featured Reel Find</span>
              </div>
            </div>

            {/* Spotlight Card Footer Info */}
            <div className="p-4 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-text)]">
                    Curator&apos;s Highlight
                  </p>
                  <h2 className="mt-1 truncate text-base font-bold text-[var(--text-primary)]">
                    {featuredProduct?.name ?? 'Curated Amazon Highlight'}
                  </h2>
                </div>

                {featuredProduct?.price !== null &&
                  featuredProduct?.price !== undefined && (
                    <span className="shrink-0 text-base font-extrabold text-[var(--text-primary)]">
                      ₹{Number(featuredProduct.price).toLocaleString('en-IN')}
                    </span>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2.5">
                {featuredProduct?.amazonUrl ? (
                  <a
                    href={featuredProduct.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-2.5 text-xs font-bold text-slate-950 shadow-xs transition-all duration-200 hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Check Price on Amazon</span>
                    <ArrowUpRight size={14} strokeWidth={2.4} />
                  </a>
                ) : (
                  <Link
                    href="/products"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-2.5 text-xs font-bold text-slate-950 shadow-xs transition-all duration-200 hover:bg-[var(--accent-hover)]"
                  >
                    <span>Explore All Finds</span>
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                )}

                {featuredProduct?.slug && (
                  <Link
                    href={`/products/${featuredProduct.slug}`}
                    className="flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-muted)]"
                  >
                    Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
