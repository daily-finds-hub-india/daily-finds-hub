import { prisma } from '@/lib/prisma';

export interface PublicCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  imageUrl: string | null;
  productCount: number;
}

export async function getPublicCategoriesList(): Promise<PublicCategoryItem[]> {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: { isPublished: true }
      }
    },
    orderBy: { name: 'asc' },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        take: 1
      },
      _count: {
        select: {
          products: {
            where: { isPublished: true }
          }
        }
      }
    }
  });

  return categories.map((cat) => {
    const primaryImage = cat.images[0] ?? null;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      isFeatured: cat.isFeatured,
      imageUrl: primaryImage?.url ?? null,
      productCount: cat._count.products
    };
  });
}
