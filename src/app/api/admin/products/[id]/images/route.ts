import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { apiSuccess } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';
import { verifyCloudinaryProductImage } from '@/lib/cloudinary/validation';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MAX_IMAGE_COUNT = 50;
const MAX_ALT_TEXT_LENGTH = 300;
const MAX_PUBLIC_ID_LENGTH = 500;

const createProductImageSchema = z
  .object({
    publicId: z.string().trim().min(1).max(MAX_PUBLIC_ID_LENGTH),

    altText: z.string().trim().min(1).max(MAX_ALT_TEXT_LENGTH),

    displayOrder: z.number().int().min(0).max(1000).optional(),

    isPrimary: z.boolean().optional().default(false)
  })
  .strict();

export async function POST(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

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

    const parsedBody = await parseJson(request);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const validation = validate(createProductImageSchema, parsedBody.data);

    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const product = await prisma.product.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        _count: {
          select: {
            images: true
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

    if (product._count.images >= MAX_IMAGE_COUNT) {
      return NextResponse.json(
        {
          error: `A product can have at most ${MAX_IMAGE_COUNT} images`
        },
        {
          status: 400
        }
      );
    }

    /*
     * Verify the uploaded Cloudinary asset directly with
     * Cloudinary.
     *
     * We intentionally do NOT accept the image URL from the
     * client. Cloudinary is the source of truth.
     */
    let cloudinaryImage;

    try {
      cloudinaryImage = await verifyCloudinaryProductImage(
        data.publicId,
        product.id
      );
    } catch (error) {
      console.error('[CLOUDINARY_IMAGE_VALIDATION_ERROR]', error);

      return NextResponse.json(
        {
          error: 'Invalid or unavailable Cloudinary image'
        },
        {
          status: 400
        }
      );
    }

    /*
     * Save the image inside a transaction.
     *
     * If this image is primary, all other images for this
     * product are first changed to non-primary.
     */
    try {
      const image = await prisma.$transaction(async (tx) => {
        const currentImageCount = await tx.productImage.count({
          where: {
            productId: product.id
          }
        });

        /*
         * Re-check the count inside the transaction because
         * another request could have uploaded an image after
         * the initial count check.
         */
        if (currentImageCount >= MAX_IMAGE_COUNT) {
          throw new Error('PRODUCT_IMAGE_LIMIT_REACHED');
        }

        /*
         * Prevent the same Cloudinary asset from being attached
         * to this product more than once.
         */
        const existingImage = await tx.productImage.findFirst({
          where: {
            productId: product.id,
            publicId: cloudinaryImage.publicId
          },
          select: {
            id: true
          }
        });

        if (existingImage) {
          throw new Error('IMAGE_ALREADY_EXISTS');
        }

        if (data.isPrimary) {
          await tx.productImage.updateMany({
            where: {
              productId: product.id,
              isPrimary: true
            },
            data: {
              isPrimary: false
            }
          });
        }

        return tx.productImage.create({
          data: {
            productId: product.id,
            url: cloudinaryImage.url,
            publicId: cloudinaryImage.publicId,
            altText: data.altText,
            displayOrder: data.displayOrder ?? currentImageCount,
            isPrimary: data.isPrimary
          },
          select: {
            id: true,
            productId: true,
            url: true,
            publicId: true,
            altText: true,
            displayOrder: true,
            isPrimary: true,
            createdAt: true
          }
        });
      });

      return apiSuccess(image, 201);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'PRODUCT_IMAGE_LIMIT_REACHED'
      ) {
        return NextResponse.json(
          {
            error: `A product can have at most ${MAX_IMAGE_COUNT} images`
          },
          {
            status: 400
          }
        );
      }

      if (error instanceof Error && error.message === 'IMAGE_ALREADY_EXISTS') {
        return NextResponse.json(
          {
            error: 'This image is already attached to the product'
          },
          {
            status: 409
          }
        );
      }

      throw error;
    }
  } catch (error) {
    return serverError(error);
  }
}
