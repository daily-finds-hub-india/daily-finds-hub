// src/lib/services/admin-product.server.ts
import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getAdminProductsData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ]);

  const formattedProducts = products.map((prod) => {
    const primaryImage =
      prod.images.find((img) => img.isPrimary) ?? prod.images[0] ?? null;

    return {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      shortDescription: prod.shortDescription ?? '',
      description: prod.description ?? '',
      categoryId: prod.categoryId,
      categoryName: prod.category?.name ?? 'Uncategorized',
      price: Number(prod.price),
      originalPrice: prod.originalPrice ? Number(prod.originalPrice) : null,
      rating: prod.rating ? Number(prod.rating) : null,
      reviewCount: prod.reviewCount,
      amazonUrl: prod.amazonUrl,
      asin: prod.asin,
      isFeatured: prod.isFeatured,
      isTrending: prod.isTrending,
      isPublished: prod.isPublished,
      imageUrl: primaryImage?.url ?? null,
      imagePublicId: primaryImage?.publicId ?? null,
      images: prod.images.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        altText: img.altText,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder
      })),
      createdAt: prod.createdAt.toISOString().split('T')[0],
      updatedAt: prod.updatedAt.toISOString()
    };
  });

  return { products: formattedProducts, categories };
}
