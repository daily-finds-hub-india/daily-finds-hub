import { prisma } from '@/lib/prisma';

export const publicImageOrder = [
  { isPrimary: 'desc' as const },
  { displayOrder: 'asc' as const }
];

export async function getPublicCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      images: { orderBy: publicImageOrder },
      _count: { select: { products: true } }
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

  return prisma.product.findMany({
    where: {
      isPublished: true,
      ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
      ...(options?.search ? {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' } },
          { shortDescription: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } }
        ]
      } : {})
    },
    orderBy,
    ...(options?.take ? { take: options.take } : {}),
    include: {
      images: { orderBy: publicImageOrder },
      _count: { select: { images: true } }
    }
  });
}

export async function getPublicProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: { images: { orderBy: publicImageOrder } }
  });
}

export async function getPublicCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      images: { orderBy: publicImageOrder },
      products: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: publicImageOrder },
          _count: { select: { images: true } }
        }
      }
    }
  });
}
