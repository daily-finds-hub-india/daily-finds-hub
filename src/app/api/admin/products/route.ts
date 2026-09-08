import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { parseJson } from '@/lib/api/parse-json';
import { serverError } from '@/lib/api/server-error';
import { apiSuccess } from '@/lib/api/response';
import { validate } from '@/lib/api/validate';
import {
  createProductSchema,
  productQuerySchema
} from '@/lib/validation/product';

export async function POST(request: Request) {
  try {
    /*
     * Authentication, authorization, same-origin protection,
     * session-version validation, and admin API rate limiting.
     */
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    /*
     * Validate Content-Type, body size, and JSON syntax.
     */
    const parsedBody = await parseJson(request);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    /*
     * Validate the complete product payload.
     */
    const validation = validate(createProductSchema, parsedBody.data);

    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    /*
     * Verify that the referenced category exists.
     */
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId
      },
      select: {
        id: true
      }
    });

    if (!category) {
      return NextResponse.json(
        {
          error: 'Category not found'
        },
        {
          status: 404
        }
      );
    }

    /*
     * Check slug uniqueness before attempting the insert.
     *
     * This improves the client-facing error, while the database
     * unique constraint remains the final source of truth.
     */
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: data.slug
      },
      select: {
        id: true
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: 'A product with this slug already exists'
        },
        {
          status: 409
        }
      );
    }

    /*
     * Explicitly construct the database object.
     *
     * Never pass the client payload directly to Prisma.
     */
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,

        price: data.price,
        originalPrice: data.originalPrice,

        rating: data.rating,
        reviewCount: data.reviewCount ?? 0,

        amazonUrl: data.amazonUrl,
        asin: data.asin,

        isFeatured: data.isFeatured,
        isTrending: data.isTrending,
        isPublished: data.isPublished
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        categoryId: true,
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
        updatedAt: true
      }
    });

    return apiSuccess(product, 201);
  } catch (error) {
    /*
     * Prisma unique constraints are still enforced at the database
     * level in case two requests race between the uniqueness check
     * and the INSERT.
     */
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error: 'A product with this slug already exists'
        },
        {
          status: 409
        }
      );
    }

    return serverError(error);
  }
}

export async function GET(request: Request) {
  try {
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

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
                shortDescription: {
                  contains: search,
                  mode: 'insensitive' as const
                }
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive' as const
                }
              },
              {
                asin: {
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
          categoryId: true,
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

          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },

          images: {
            orderBy: {
              displayOrder: 'asc'
            },
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
