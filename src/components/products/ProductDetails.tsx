'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react';

import type { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
}

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const galleryVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.985
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const images = product.images ?? [];

  const primaryIndex = Math.max(
    0,
    images.findIndex((image) => image.isPrimary)
  );

  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);

  const image = images[selectedIndex] ?? images[0];

  const price =
    product.price !== null && product.price !== undefined
      ? Number(product.price)
      : null;

  const originalPrice =
    product.originalPrice !== null && product.originalPrice !== undefined
      ? Number(product.originalPrice)
      : null;

  const discountPercent =
    price !== null && originalPrice !== null && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-16">
      {/* Product gallery */}
      <motion.div
        className="min-w-0 lg:col-span-6"
        variants={galleryVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-card)] sm:rounded-3xl">
          {image ? (
            <motion.div
              key={image.url}
              className="absolute inset-0"
              initial={{
                opacity: 0.65,
                scale: 1.015
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.35,
                ease: 'easeOut'
              }}
            >
              <Image
                src={image.url}
                alt={image.altText || product.name}
                fill
                sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]"
              aria-hidden="true"
            >
              <Sparkles
                size={40}
                strokeWidth={1.5}
                className="sm:h-12 sm:w-12"
              />
            </div>
          )}

          {/* Product badges */}
          {(product.isTrending || product.isFeatured) && (
            <motion.div
              className="absolute inset-x-3 top-3 flex flex-wrap items-start gap-2 sm:left-4 sm:right-auto sm:top-4"
              initial={{
                opacity: 0,
                y: -8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2,
                duration: 0.35,
                ease: 'easeOut'
              }}
            >
              {product.isTrending && (
                <span className="inline-flex min-h-7 items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow-xs sm:px-3 sm:text-xs">
                  <Flame size={13} strokeWidth={2.4} aria-hidden="true" />
                  <span>Trending Find</span>
                </span>
              )}

              {product.isFeatured && (
                <span className="inline-flex min-h-7 items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md dark:bg-slate-800/90 sm:px-3 sm:text-xs">
                  <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
                  <span>Curator&apos;s Pick</span>
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Gallery thumbnails */}
        {images.length > 1 && (
          <motion.div
            className="themed-scrollbar -mx-1 mt-3 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 sm:mt-4 sm:gap-3"
            aria-label="Product images"
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15,
              duration: 0.4,
              ease: 'easeOut'
            }}
          >
            {images.map((galleryImage, index) => {
              const selected = selectedIndex === index;

              return (
                <motion.button
                  key={galleryImage.id ?? galleryImage.url}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selected}
                  whileTap={{
                    scale: 0.96
                  }}
                  className={[
                    'relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:w-20 sm:rounded-xl',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
                    selected
                      ? 'border-[var(--accent)] shadow-sm'
                      : 'border-[var(--border)] opacity-70 hover:opacity-100'
                  ].join(' ')}
                >
                  <Image
                    src={galleryImage.url}
                    alt={
                      galleryImage.altText ||
                      `${product.name} image ${index + 1}`
                    }
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Product information */}
      <motion.div
        className="min-w-0 flex flex-col justify-center lg:col-span-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={contentVariants}>
          <Link
            href="/products"
            className="group mb-4 inline-flex min-h-8 w-fit items-center gap-2 rounded-sm text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:mb-5 sm:text-xs"
          >
            <ArrowLeft
              size={14}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>Back to All Finds</span>
          </Link>
        </motion.div>

        <motion.div variants={contentVariants}>
          <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl xl:text-[2.65rem]">
            {product.name}
          </h1>
        </motion.div>

        {/* Short description */}
        {product.shortDescription && (
          <motion.p
            variants={contentVariants}
            className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[var(--text-secondary)] sm:text-base"
          >
            {product.shortDescription}
          </motion.p>
        )}

        {/* Rating */}
        {product.rating !== null && product.rating !== undefined && (
          <motion.div
            variants={contentVariants}
            className="mt-4 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm"
          >
            <div className="flex shrink-0 items-center gap-1 text-[var(--accent)]">
              <Star
                size={16}
                fill="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span className="font-bold text-[var(--text-primary)]">
                {Number(product.rating).toFixed(1)}
              </span>
            </div>

            {product.reviewCount !== null &&
              product.reviewCount !== undefined && (
                <span className="text-xs text-[var(--text-muted)]">
                  ({product.reviewCount.toLocaleString('en-IN')} Amazon ratings)
                </span>
              )}
          </motion.div>
        )}

        {/* Price */}
        <motion.div
          variants={contentVariants}
          className="mt-5 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs sm:mt-6 sm:p-5"
        >
          {price !== null ? (
            <>
              <span className="text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
                ₹{price.toLocaleString('en-IN')}
              </span>

              {originalPrice !== null && originalPrice > price && (
                <span className="text-sm text-[var(--text-muted)] line-through sm:text-base">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}

              {discountPercent !== null && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-semibold text-[var(--text-secondary)] sm:text-base">
              Price available on Amazon
            </span>
          )}
        </motion.div>

        {/* Full description */}
        {product.description && (
          <motion.div
            variants={contentVariants}
            className="mt-6 border-t border-[var(--border)] pt-6"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Why It&apos;s Worth Considering
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base sm:leading-7">
              {product.description}
            </p>
          </motion.div>
        )}

        {/* Amazon CTA */}
        <motion.div variants={contentVariants} className="mt-7 sm:mt-8">
          {product.amazonUrl ? (
            <div className="space-y-3">
              <motion.a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                aria-label={`Check price and view ${product.name} on Amazon.in`}
                whileHover={{
                  scale: 1.01
                }}
                whileTap={{
                  scale: 0.99
                }}
                className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-4 text-center text-sm font-extrabold leading-snug text-slate-950 shadow-md transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:gap-3 sm:px-5 sm:text-base"
              >
                <span>Check Price &amp; Availability on Amazon</span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={2.4}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </motion.a>

              <div className="flex items-start gap-2 rounded-xl bg-[var(--surface-muted)] px-3.5 py-2.5 text-[11px] leading-relaxed text-[var(--text-muted)] sm:px-4 sm:text-xs">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />

                <span>
                  Opens directly on Amazon.in. As an Amazon Associate, we earn
                  from qualifying purchases.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              The Amazon link for this curated find is being verified and will
              be available shortly.
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
