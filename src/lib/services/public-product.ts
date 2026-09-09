// src/lib/services/public-product.ts
import { prisma } from '@/lib/prisma';
import { Product, ProductImageItem } from '@/types/product';

export type PublicProductItem = Product;

export interface PublicProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean;
  trending?: boolean;
  sort?: 'newest' | 'oldest' | 'name' | 'price' | 'rating';
  direction?: 'asc' | 'desc';
}

export async function getPublicProductsList(
  params: PublicProductQueryParams = {}
) {
  const {
    page = 1,
    pageSize = 20,
    search,
    categoryId,
    featured,
    trending,
    sort = 'newest',
    direction = 'desc'
  } = params;

  const where = {
    isPublished: true,
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const
              }
            },
            {
              shortDescription: {
                contains: search,
                mode: 'insensitive' as const
              }
            }
          ]
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(featured !== undefined ? { isFeatured: featured } : {}),
    ...(trending !== undefined ? { isTrending: trending } : {})
  };

  const sortField = {
    newest: 'createdAt',
    oldest: 'createdAt',
    name: 'name',
    price: 'price',
    rating: 'rating'
  }[sort];

  const sortDirection = sort === 'oldest' ? 'asc' : direction;

  const orderBy = {
    [sortField]: sortDirection
  };

  const skip = (page - 1) * pageSize;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        price: true,
        originalPrice: true,
        rating: true,
        reviewCount: true,
        amazonUrl: true,
        asin: true,
        isFeatured: true,
        isTrending: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { displayOrder: 'asc' },
            { createdAt: 'asc' }
          ],
          select: {
            id: true,
            url: true,
            publicId: true,
            altText: true,
            displayOrder: true,
            isPrimary: true
          }
        }
      }
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  const items: PublicProductItem[] = products.map((prod) => {
    const images: ProductImageItem[] = prod.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary
    }));

    const primaryImage = images.find((i) => i.isPrimary) || images[0] || null;

    return {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      shortDescription: prod.shortDescription,
      description: prod.description,
      categoryId: prod.categoryId,
      categoryName: prod.category.name,
      price: Number(prod.price),
      originalPrice:
        prod.originalPrice !== null ? Number(prod.originalPrice) : null,
      rating: prod.rating !== null ? Number(prod.rating) : null,
      reviewCount: prod.reviewCount,
      amazonUrl: prod.amazonUrl,
      asin: prod.asin,
      isFeatured: prod.isFeatured,
      isTrending: prod.isTrending,
      isPublished: prod.isPublished,
      images,
      imageUrl: primaryImage?.url ?? null,
      imagePublicId: primaryImage?.publicId ?? null,
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString()
    };
  });

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

export async function getPublicProductBySlug(
  slug: string
): Promise<Product | null> {
  const prod = await prisma.product.findFirst({
    where: {
      slug,
      isPublished: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      description: true,
      categoryId: true,
      category: {
        select: {
          name: true
        }
      },
      price: true,
      originalPrice: true,
      rating: true,
      reviewCount: true,
      amazonUrl: true,
      asin: true,
      isFeatured: true,
      isTrending: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      images: {
        orderBy: [
          { isPrimary: 'desc' },
          { displayOrder: 'asc' },
          { createdAt: 'asc' }
        ],
        select: {
          id: true,
          url: true,
          publicId: true,
          altText: true,
          displayOrder: true,
          isPrimary: true
        }
      }
    }
  });

  if (!prod) {
    return null;
  }

  const images: ProductImageItem[] = prod.images.map((img) => ({
    id: img.id,
    url: img.url,
    publicId: img.publicId,
    altText: img.altText,
    displayOrder: img.displayOrder,
    isPrimary: img.isPrimary
  }));

  const primaryImage = images.find((i) => i.isPrimary) || images[0] || null;

  return {
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    shortDescription: prod.shortDescription,
    description: prod.description,
    categoryId: prod.categoryId,
    categoryName: prod.category.name,
    price: Number(prod.price),
    originalPrice:
      prod.originalPrice !== null ? Number(prod.originalPrice) : null,
    rating: prod.rating !== null ? Number(prod.rating) : null,
    reviewCount: prod.reviewCount,
    amazonUrl: prod.amazonUrl,
    asin: prod.asin,
    isFeatured: prod.isFeatured,
    isTrending: prod.isTrending,
    isPublished: prod.isPublished,
    images,
    imageUrl: primaryImage?.url ?? null,
    imagePublicId: primaryImage?.publicId ?? null,
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString()
  };
}
