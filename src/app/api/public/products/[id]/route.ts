import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const idValidation = cuidSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid product ID'
        },
        {
          status: 400
        }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: idValidation.data,
        isPublished: true
      },

      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,

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
    });

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found'
        },
        {
          status: 404
        }
      );
    }

    return apiSuccess(product);
  } catch (error) {
    return serverError(error);
  }
}
