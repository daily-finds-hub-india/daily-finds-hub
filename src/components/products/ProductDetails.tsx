'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string | null;
  originalPrice: string | null;
  rating: string | null;
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

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const images = product.images ?? [];
  const primaryIndex = Math.max(
    0,
    images.findIndex((item) => item.isPrimary)
  );
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);
  const image = images[selectedIndex] ?? images[0];

  const priceNum = product.price ? Number(product.price) : null;
  const originalPriceNum = product.originalPrice
    ? Number(product.originalPrice)
    : null;
  const discountPercent =
    priceNum && originalPriceNum && originalPriceNum > priceNum
      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
      : null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
      {/* Left Column: Gallery */}
      <div className="lg:col-span-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-card)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-opacity duration-300"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
              <Sparkles size={48} strokeWidth={1.5} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {product.isTrending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-slate-950 shadow-xs">
                <Flame size={13} strokeWidth={2.4} />
                <span>Trending Find</span>
              </span>
            )}
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-xs dark:bg-slate-800/90">
                <Sparkles size={12} strokeWidth={2} />
                <span>Curator&apos;s Pick</span>
              </span>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="themed-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((galleryImage, index) => (
              <button
                key={galleryImage.url}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View product image ${index + 1}`}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-[var(--accent)] shadow-sm scale-105'
                    : 'border-[var(--border)] opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={galleryImage.url}
                  alt={galleryImage.altText || product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Information & Outbound CTA */}
      <div className="flex flex-col justify-center lg:col-span-6">
        <Link
          href="/products"
          className="group mb-5 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span>Back to All Finds</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)]">
          {product.name}
        </h1>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-[var(--text-secondary)]">
            {product.shortDescription}
          </p>
        )}

        {/* Rating and Reviews */}
        {product.rating !== null && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-[var(--accent)]">
              <Star size={16} fill="currentColor" strokeWidth={1.5} />
              <span className="font-bold text-[var(--text-primary)]">
                {product.rating}
              </span>
            </div>
            {product.reviewCount > 0 && (
              <span className="text-xs text-[var(--text-muted)]">
                ({product.reviewCount.toLocaleString('en-IN')} Amazon ratings)
              </span>
            )}
          </div>
        )}

        {/* Price Box */}
        <div className="mt-6 flex flex-wrap items-baseline gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs">
          {priceNum !== null ? (
            <>
              <span className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                ₹{priceNum.toLocaleString('en-IN')}
              </span>
              {originalPriceNum !== null && originalPriceNum > priceNum && (
                <span className="text-base text-[var(--text-muted)] line-through">
                  ₹{originalPriceNum.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent !== null && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          ) : (
            <span className="text-base font-semibold text-[var(--text-secondary)]">
              Price available on Amazon
            </span>
          )}
        </div>

        {/* Description Full */}
        <div className="mt-6 border-t border-[var(--border)] pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Why It&apos;s Worth Considering
          </h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            {product.description}
          </p>
        </div>

        {/* Amazon Outbound Button */}
        <div className="mt-8">
          {product.amazonUrl ? (
            <div className="space-y-3">
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                aria-label={`Check price and view ${product.name} on Amazon.in`}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent)] py-4 text-base font-extrabold text-slate-950 shadow-md transition-all duration-200 hover:bg-[var(--accent-hover)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Check Price & Availability on Amazon</span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={2.4}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Affiliate Disclosure Card */}
              <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
                <ShieldCheck
                  size={16}
                  className="text-[var(--accent)] shrink-0"
                />
                <span>
                  Opens directly on Amazon.in. As an Amazon Associate, we earn
                  from qualifying purchases.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-secondary)]">
              The Amazon link for this curated find is being verified and will
              be available shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
