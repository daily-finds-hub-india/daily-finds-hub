import 'server-only';
import { prisma } from '@/lib/prisma';
import { Category } from '@/types/category';

export async function getAdminCategoriesList(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
      },
      _count: {
        select: { products: true }
      }
    }
  });

  return categories.map((cat) => {
    const primaryImage =
      cat.images.find((img) => img.isPrimary) ?? cat.images[0] ?? null;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      isFeatured: cat.isFeatured,
      isPublished: cat.isPublished,
      productCount: cat._count.products,
      imageUrl: primaryImage?.url ?? null,
      imagePublicId: primaryImage?.publicId ?? null,
      images: cat.images.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        altText: img.altText,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder
      })),
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString()
    };
  });
}
