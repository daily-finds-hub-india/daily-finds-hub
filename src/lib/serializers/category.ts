import type { Category as PrismaCategory } from '@/generated/prisma/client';

import type { Category } from '@/types/category';

type PrismaCategoryWithImages = PrismaCategory & {
  images: {
    id: string;
    url: string;
    publicId: string;
    altText: string;
    displayOrder: number;
    isPrimary: boolean;
  }[];
};

export function serializeCategory(
  category: PrismaCategoryWithImages
): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,

    isFeatured: category.isFeatured,

    images: category.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      altText: image.altText,
      displayOrder: image.displayOrder,
      isPrimary: image.isPrimary
    }))
  };
}
