'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';

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

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[48%] w-[48%] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(0,0,0,0.12)]" />
            </div>
          )}

          {product.isTrending && (
            <span className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Trending
            </span>
          )}
        </div>

        {images.length > 1 ? (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((galleryImage, index) => (
              <button
                key={galleryImage.url}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View product image ${index + 1}`}
                className={`relative aspect-square overflow-hidden rounded-[var(--radius-md)] border-2 ${
                  selectedIndex === index
                    ? 'border-[var(--accent)]'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={galleryImage.url}
                  alt={galleryImage.altText || product.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col justify-center">
        <Link
          href="/products"
          className="group mb-8 inline-flex w-fit items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to finds
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Product
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">
          {product.name}
        </h1>

        <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
          {product.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[var(--border)] py-5">
          {product.price !== null && (
            <span className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          )}

          {product.originalPrice !== null && (
            <span className="text-sm text-[var(--text-muted)] line-through">
              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
            </span>
          )}

          {product.rating !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Star size={15} fill="currentColor" strokeWidth={1.5} />

              <span className="font-medium text-[var(--text-primary)]">
                {product.rating}
              </span>

              {product.reviewCount > 0 && (
                <span className="text-[var(--text-muted)]">
                  ({product.reviewCount.toLocaleString('en-IN')})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          {product.amazonUrl ? (
            <div>
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                aria-label={`View ${product.name} on Amazon.in (affiliate link)`}
                className="group inline-flex items-center gap-3 bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--background)] transition-colors duration-200 hover:bg-[var(--accent)]"
              >
                View on Amazon
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                Affiliate link. We may earn from qualifying purchases.
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Amazon link will be added when this product is ready.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
