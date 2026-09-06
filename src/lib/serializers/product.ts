import type { Product as PrismaProduct } from '@/generated/prisma/client';

import type { Product } from '@/types/product';

type PrismaProductWithImages = PrismaProduct & {
  images: {
    id: string;
    url: string;
    publicId: string;
    altText: string;
    displayOrder: number;
    isPrimary: boolean;
  }[];
};

export function serializeProduct(product: PrismaProductWithImages): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    categoryId: product.categoryId,

    price: Number(product.price),

    originalPrice:
      product.originalPrice === null ? null : Number(product.originalPrice),

    rating: product.rating === null ? null : Number(product.rating),

    reviewCount: product.reviewCount,

    amazonUrl: product.amazonUrl,
    asin: product.asin,

    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    isPublished: product.isPublished,

    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      altText: image.altText,
      displayOrder: image.displayOrder,
      isPrimary: image.isPrimary
    }))
  };
}
