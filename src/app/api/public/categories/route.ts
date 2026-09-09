import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { apiSuccess } from '@/lib/api/response';
import { categoryQuerySchema } from '@/lib/validation/category';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validation = validate(categoryQuerySchema, searchParams);

    if (!validation.success) {
      return validation.response;
    }

    const { page, pageSize, search, featured, sort, direction } =
      validation.data;

    const where = {
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
                description: {
                  contains: search,
                  mode: 'insensitive' as const
                }
              }
            ]
          }
        : {}),

      ...(featured !== undefined
        ? {
            isFeatured: featured === 'true'
          }
        : {})
    };

    const orderBy =
      sort === 'name'
        ? { name: direction }
        : sort === 'oldest'
          ? { createdAt: direction }
          : { createdAt: direction };

    const skip = (page - 1) * pageSize;

    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,

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
      }),

      prisma.category.count({
        where
      })
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const data = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      isFeatured: category.isFeatured,
      images: category.images,
      productCount: category._count.products
    }));

    return apiSuccess({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    return serverError(error);
  }
}
