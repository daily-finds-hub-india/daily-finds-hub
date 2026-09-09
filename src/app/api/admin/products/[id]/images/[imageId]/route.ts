import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { scheduleCloudinaryCleanup } from '@/lib/cloudinary/cleanup';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { apiError, apiSuccess } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';
import {
  productIdSchema,
  productImageIdSchema
} from '@/lib/validation/product';

interface RouteContext {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
}

const MAX_ALT_TEXT_LENGTH = 300;

const updateProductImageSchema = z
  .object({
    altText: z.string().trim().min(1).max(MAX_ALT_TEXT_LENGTH).optional(),
    displayOrder: z.number().int().min(0).max(1000).optional(),
    isPrimary: z.boolean().optional()
  })
  .strict();

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

function isPrismaNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2025'
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const { id, imageId } = await context.params;

    const productIdValidation = productIdSchema.safeParse(id);

    if (!productIdValidation.success) {
      return apiError('Invalid product ID', 400);
    }

    const imageIdValidation = productImageIdSchema.safeParse(imageId);

    if (!imageIdValidation.success) {
      return apiError('Invalid image ID', 400);
    }

    const parsedBody = await parseJson(request);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const validation = validate(updateProductImageSchema, parsedBody.data);

    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    if (Object.keys(data).length === 0) {
      return apiError('No fields provided for update', 400);
    }

    const existingImage = await prisma.productImage.findFirst({
      where: {
        id: imageIdValidation.data,
        productId: productIdValidation.data
      },
      select: {
        id: true,
        productId: true,
        url: true,
        publicId: true,
        altText: true,
        displayOrder: true,
        isPrimary: true
      }
    });

    if (!existingImage) {
      return apiError('Product image not found', 404);
    }

    try {
      const image = await prisma.$transaction(async (tx) => {
        /*
         * Serialize primary-image changes for this product.
         *
         * This uses the same lock namespace as the product
         * image creation endpoint.
         */
        if (data.isPrimary === true) {
          await tx.$executeRaw`
            SELECT pg_advisory_xact_lock(
              hashtextextended(
                ${`daily-finds-hub:product-images:${existingImage.productId}`},
                0
              )
            )
          `;

          /*
           * Make every other image non-primary before making
           * this image primary.
           */
          await tx.productImage.updateMany({
            where: {
              productId: existingImage.productId,
              id: {
                not: existingImage.id
              },
              isPrimary: true
            },
            data: {
              isPrimary: false
            }
          });
        }

        const updateData: {
          altText?: string;
          displayOrder?: number;
          isPrimary?: boolean;
        } = {};

        if (data.altText !== undefined) {
          updateData.altText = data.altText;
        }

        if (data.displayOrder !== undefined) {
          updateData.displayOrder = data.displayOrder;
        }

        if (data.isPrimary !== undefined) {
          updateData.isPrimary = data.isPrimary;
        }

        return tx.productImage.update({
          where: {
            id: existingImage.id
          },
          data: updateData,
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

      return apiSuccess(image);
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        return apiError('Product can have only one primary image', 409);
      }

      if (isPrismaNotFoundError(error)) {
        return apiError('Product image not found', 404);
      }

      throw error;
    }
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const authResult = await requireApiAdmin(request);

    if (!authResult.authorized) {
      return authResult.response;
    }

    const { id, imageId } = await context.params;

    const productIdValidation = productIdSchema.safeParse(id);

    if (!productIdValidation.success) {
      return apiError('Invalid product ID', 400);
    }

    const imageIdValidation = productImageIdSchema.safeParse(imageId);

    if (!imageIdValidation.success) {
      return apiError('Invalid image ID', 400);
    }

    const existingImage = await prisma.productImage.findFirst({
      where: {
        id: imageIdValidation.data,
        productId: productIdValidation.data
      },
      select: {
        id: true,
        publicId: true
      }
    });

    if (!existingImage) {
      return apiError('Product image not found', 404);
    }

    /*
     * PostgreSQL is the source of truth.
     *
     * Once this succeeds, the application no longer references
     * the image. Cloudinary cleanup is performed afterward.
     */
    await prisma.productImage.delete({
      where: {
        id: existingImage.id
      }
    });

    try {
      await deleteCloudinaryImage(existingImage.publicId);

      await prisma.cloudinaryCleanup.deleteMany({
        where: {
          publicId: existingImage.publicId
        }
      });
    } catch (cloudinaryError) {
      await scheduleCloudinaryCleanup(existingImage.publicId, cloudinaryError);

      console.error('[CLOUDINARY_CLEANUP_SCHEDULED]', cloudinaryError);
    }

    return apiSuccess({
      message: 'Product image deleted successfully'
    });
  } catch (error) {
    return serverError(error);
  }
}
