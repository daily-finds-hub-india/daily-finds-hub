import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
  const price = isDatabaseProduct
    ? product.price
    : (product.price?.amount ?? null);
  const image = isDatabaseProduct
    ? product.images?.find((item) => item.isPrimary) ?? product.images?.[0]
    : product.image;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)]">
          {image ? (
            <Image
              src={typeof image === 'string' ? image : image.url}
              alt={typeof image === 'string' ? product.name : image.altText}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1/2 w-1/2 border border-[var(--border-strong)] bg-[var(--surface)] transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}

          {isTrending && (
            <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Trending
            </span>
          )}

          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] opacity-0 shadow-[var(--shadow-subtle)] transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </span>
        </div>

        <div className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-medium leading-6 tracking-[-0.02em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                {product.name}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            </div>

            {price !== null && price !== undefined && (
              <span className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
                ₹{Number(price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
