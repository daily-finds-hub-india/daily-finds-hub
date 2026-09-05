import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Flame, Sparkles, Star } from 'lucide-react';

type DatabaseProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: unknown;
  originalPrice: unknown;
  rating: unknown;
  reviewCount: number;
  amazonUrl: string | null;
  asin: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  images?: ProductImage[];
};

type ProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

type LegacyProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price?: {
    amount: number;
  };
  featured?: boolean;
  trending?: boolean;
};

export type Product = DatabaseProduct | LegacyProduct;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isDatabaseProduct = 'shortDescription' in product;
  const description = isDatabaseProduct
    ? product.shortDescription
    : product.description;
  const isTrending = isDatabaseProduct ? product.isTrending : product.trending;
  const isFeatured = isDatabaseProduct ? product.isFeatured : product.featured;
  const price = isDatabaseProduct
    ? product.price
    : (product.price?.amount ?? null);
  const originalPrice = isDatabaseProduct ? product.originalPrice : null;
  const amazonUrl = isDatabaseProduct ? product.amazonUrl : null;
  const image = isDatabaseProduct
    ? (product.images?.find((item) => item.isPrimary) ?? product.images?.[0])
    : product.image;
  const rating = isDatabaseProduct ? product.rating : null;
  const reviewCount = isDatabaseProduct ? product.reviewCount : 0;

  const imageUrl = typeof image === 'string' ? image : image?.url;
  const imageAlt = typeof image === 'string' ? product.name : (image?.altText ?? product.name);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]">
      {/* Product Image & Badges */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-muted)] focus-visible:outline-none"
        tabIndex={0}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-muted)] text-[var(--text-muted)]">
            <Sparkles size={28} strokeWidth={1.5} />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-1.5 pointer-events-none">
          {isTrending ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-slate-950 shadow-xs">
              <Flame size={12} strokeWidth={2.5} />
              <span>Trending</span>
            </span>
          ) : <span />}

          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs dark:bg-slate-800/90">
              <Sparkles size={11} strokeWidth={2} />
              <span>Featured</span>
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="block focus-visible:outline-none"
          >
            <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]">
              {product.name}
            </h3>
          </Link>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          )}

          {rating !== null && rating !== undefined ? (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Star
                size={13}
                fill="currentColor"
                strokeWidth={1.5}
                className="text-[var(--accent)]"
              />
              <span className="font-bold text-[var(--text-primary)]">
                {String(rating)}
              </span>
              {reviewCount > 0 ? (
                <span>({reviewCount.toLocaleString('en-IN')})</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Pricing & Action Row */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3.5">
          <div>
            {price !== null && price !== undefined ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
                  ₹{Number(price).toLocaleString('en-IN')}
                </span>
                {originalPrice !== null && originalPrice !== undefined && Number(originalPrice) > Number(price) && (
                  <span className="text-xs text-[var(--text-muted)] line-through">
                    ₹{Number(originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                See on Amazon
              </span>
            )}
          </div>

          {amazonUrl ? (
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-xs transition-all duration-200 hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
              aria-label={`Check price on Amazon for ${product.name}`}
            >
              <span>Amazon</span>
              <ArrowUpRight size={13} strokeWidth={2.4} />
            </a>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--surface-strong)]"
            >
              <span>Details</span>
              <ArrowUpRight size={13} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

