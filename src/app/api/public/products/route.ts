import { prisma } from '@/lib/prisma';
import { apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { validate } from '@/lib/api/validate';
import { productQuerySchema } from '@/lib/validation/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const validation = validate(productQuerySchema, {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      featured: searchParams.get('featured') ?? undefined,
      trending: searchParams.get('trending') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      direction: searchParams.get('direction') ?? undefined
    });

    if (!validation.success) {
      return validation.response;
    }

    const {
      page,
      pageSize,
      search,
      categoryId,
      featured,
      trending,
      sort,
      direction
    } = validation.data;

    /*
     * Public APIs must ONLY expose published products.
     *
     * There is intentionally no way for a client to request
     * unpublished products through query parameters.
     */
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

      ...(categoryId
        ? {
            categoryId
          }
        : {}),

      ...(featured !== undefined
        ? {
            isFeatured: featured === 'true'
          }
        : {}),

      ...(trending !== undefined
        ? {
            isTrending: trending === 'true'
          }
        : {})
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

          isFeatured: true,
          isTrending: true,

          images: {
            orderBy: {
              displayOrder: 'asc'
            },
            select: {
              id: true,
              url: true,
              altText: true,
              displayOrder: true,
              isPrimary: true
            }
          }
        }
      }),

      prisma.product.count({
        where
      })
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return apiSuccess({
      items: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    });
  } catch (error) {
    return serverError(error);
  }
}
