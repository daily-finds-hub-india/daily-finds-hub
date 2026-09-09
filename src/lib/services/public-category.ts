import { prisma } from '@/lib/prisma';
import { Category, CategoryImageItem } from '@/types/category';
import { Product, ProductImageItem } from '@/types/product';

export type PublicCategoryItem = Category;

export interface CategoryWithProducts extends Category {
  products: Product[];
  productCount: number;
}

export async function getPublicCategoriesList(): Promise<PublicCategoryItem[]> {
  const categories = await prisma.category.findMany({
    where: {
      isPublished: true,
      products: {
        some: { isPublished: true }
      }
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isFeatured: true,
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
    const images: CategoryImageItem[] = cat.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary
    }));

    const primaryImage = images.find((i) => i.isPrimary) || images[0] || null;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      isFeatured: cat.isFeatured,
      isPublished: cat.isPublished,
      productCount: cat._count.products,
      images,
      imageUrl: primaryImage?.url ?? null,
      imagePublicId: primaryImage?.publicId ?? null,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString()
    };
  });
}

export async function getPublicCategoryBySlug(
  slug: string
): Promise<CategoryWithProducts | null> {
  const cat = await prisma.category.findFirst({
    where: {
      slug,
      isPublished: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isFeatured: true,
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
      },
      products: {
        where: {
          isPublished: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { isTrending: 'desc' },
          { createdAt: 'desc' }
        ],
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

  if (!cat) {
    return null;
  }

  const images: CategoryImageItem[] = cat.images.map((img) => ({
    id: img.id,
    url: img.url,
    publicId: img.publicId,
    altText: img.altText,
    displayOrder: img.displayOrder,
    isPrimary: img.isPrimary
  }));

  const primaryImage = images.find((i) => i.isPrimary) || images[0] || null;

  const products: Product[] = cat.products.map((prod) => {
    const prodImages: ProductImageItem[] = prod.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary
    }));

    const primaryProdImage =
      prodImages.find((i) => i.isPrimary) || prodImages[0] || null;

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
      images: prodImages,
      imageUrl: primaryProdImage?.url ?? null,
      imagePublicId: primaryProdImage?.publicId ?? null,
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString()
    };
  });

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    isFeatured: cat.isFeatured,
    isPublished: cat.isPublished,
    productCount: cat._count.products,
    images,
    imageUrl: primaryImage?.url ?? null,
    imagePublicId: primaryImage?.publicId ?? null,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
    products
  };
}
