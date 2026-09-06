import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/serializers/product';
import { serializeCategory } from '@/lib/serializers/category';

export const publicImageOrder = [
  { isPrimary: 'desc' as const },
  { displayOrder: 'asc' as const }
];

export async function getPublicCategories(options?: {
  featured?: boolean;
  take?: number;
}) {
  return prisma.category.findMany({
    where: {
      ...(options?.featured !== undefined
        ? { isFeatured: options.featured }
        : {})
    },
    orderBy: {
      name: 'asc'
    },
    ...(options?.take ? { take: options.take } : {}),
    include: {
      images: {
        orderBy: publicImageOrder
      },
      _count: {
        select: {
          products: true
        }
      }
    }
  });
}

export async function getPublicProducts(options?: {
  categoryId?: string;
  sort?: string;
  search?: string;
  take?: number;
}) {
  const sort = options?.sort;

  const orderBy =
    sort === 'newest'
      ? [{ createdAt: 'desc' as const }]
      : sort === 'oldest'
        ? [{ createdAt: 'asc' as const }]
        : sort === 'price-low'
          ? [{ price: 'asc' as const }]
          : sort === 'price-high'
            ? [{ price: 'desc' as const }]
            : sort === 'rating'
              ? [{ rating: 'desc' as const }, { createdAt: 'desc' as const }]
              : sort === 'reviews'
                ? [
                    { reviewCount: 'desc' as const },
                    { createdAt: 'desc' as const }
                  ]
                : sort === 'trending'
                  ? [
                      { isTrending: 'desc' as const },
                      { createdAt: 'desc' as const }
                    ]
                  : [
                      { isFeatured: 'desc' as const },
                      { createdAt: 'desc' as const }
                    ];

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,

      ...(options?.categoryId
        ? {
            categoryId: options.categoryId
          }
        : {}),

      ...(options?.search
        ? {
            OR: [
              {
                name: {
                  contains: options.search,
                  mode: 'insensitive'
                }
              },
              {
                shortDescription: {
                  contains: options.search,
                  mode: 'insensitive'
                }
              },
              {
                description: {
                  contains: options.search,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {})
    },

    orderBy,

    ...(options?.take
      ? {
          take: options.take
        }
      : {}),

    include: {
      images: {
        orderBy: publicImageOrder
      },
      _count: {
        select: {
          images: true
        }
      }
    }
  });

  return products.map(serializeProduct);
}

export async function getPublicProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isPublished: true
    },
    include: {
      images: {
        orderBy: publicImageOrder
      }
    }
  });

  return product ? serializeProduct(product) : null;
}

export async function getPublicCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug
    },
    include: {
      images: {
        orderBy: publicImageOrder
      },
      products: {
        where: {
          isPublished: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          images: {
            orderBy: publicImageOrder
          }
        }
      }
    }
  });

  if (!category) {
    return null;
  }

  const products = category.products.map((product) =>
    serializeProduct(product)
  );

  const serializedCategory = serializeCategory(category);

  return {
    ...serializedCategory,
    products
  };
}
