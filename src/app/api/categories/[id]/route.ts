import { prisma } from '@/lib/prisma';
import { apiError, apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { categoryIdSchema } from '@/lib/validation/category';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const idValidation = categoryIdSchema.safeParse(id);

    if (!idValidation.success) {
      return apiError('Invalid category ID', 400);
    }

    const category = await prisma.category.findFirst({
      where: {
        id: idValidation.data,
        isPublished: true
      },

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,

        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { displayOrder: 'asc' },
            { createdAt: 'asc' }
          ],

          select: {
            id: true,
            url: true,
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
            price: true,
            originalPrice: true,
            rating: true,
            reviewCount: true,
            isFeatured: true,
            isTrending: true,

            images: {
              orderBy: [
                { isPrimary: 'desc' },
                { displayOrder: 'asc' },
                { createdAt: 'asc' }
              ],

              select: {
                id: true,
                url: true,
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
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    const data = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      isFeatured: category.isFeatured,
      images: category.images,
      productCount: category._count.products,
      products: category.products
    };

    return apiSuccess({
      data
    });
  } catch (error) {
    return serverError(error);
  }
}
