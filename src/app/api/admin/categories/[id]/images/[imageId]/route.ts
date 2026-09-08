import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';

import { apiError, apiSuccess } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';

import {
  categoryIdSchema,
  categoryImageIdSchema
} from '@/lib/validation/category';

import { deleteCloudinaryImage } from '@/lib/cloudinary/images';
import { scheduleCloudinaryCleanup } from '@/lib/cloudinary/cleanup';

interface RouteContext {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
}

const MAX_ALT_TEXT_LENGTH = 300;

const updateCategoryImageSchema = z
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

    const categoryIdValidation = categoryIdSchema.safeParse(id);

    if (!categoryIdValidation.success) {
      return apiError('Invalid category ID', 400);
    }

    const imageIdValidation = categoryImageIdSchema.safeParse(imageId);

    if (!imageIdValidation.success) {
      return apiError('Invalid image ID', 400);
    }

    const parsedBody = await parseJson(request);

    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const validation = validate(updateCategoryImageSchema, parsedBody.data);

    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    if (Object.keys(data).length === 0) {
      return apiError('No fields provided for update', 400);
    }

    const existingImage = await prisma.categoryImage.findFirst({
      where: {
        id: imageIdValidation.data,
        categoryId: categoryIdValidation.data
      },
      select: {
        id: true,
        categoryId: true,
        url: true,
        publicId: true,
        altText: true,
        displayOrder: true,
        isPrimary: true
      }
    });

    if (!existingImage) {
      return apiError('Category image not found', 404);
    }

    try {
      const image = await prisma.$transaction(async (tx) => {
        /*
         * Serialize primary-image changes for this
         * category.
         *
         * This uses the same advisory-lock namespace
         * as the category image creation endpoint.
         */
        if (data.isPrimary === true) {
          await tx.$executeRaw`
              SELECT pg_advisory_xact_lock(
                hashtextextended(
                  ${`daily-finds-hub:category-images:${existingImage.categoryId}`},
                  0
                )
              )
            `;

          /*
           * Make every other image non-primary before
           * making this image primary.
           */
          await tx.categoryImage.updateMany({
            where: {
              categoryId: existingImage.categoryId,
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

        return tx.categoryImage.update({
          where: {
            id: existingImage.id
          },
          data: updateData,
          select: {
            id: true,
            categoryId: true,
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
        return apiError('Category can have only one primary image', 409);
      }

      if (isPrismaNotFoundError(error)) {
        return apiError('Category image not found', 404);
      }

      throw error;
    }
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const { id, imageId } = await params;

    const categoryIdValidation = categoryIdSchema.safeParse(id);

    if (!categoryIdValidation.success) {
      return apiError('Invalid category ID', 400);
    }

    const imageIdValidation = categoryImageIdSchema.safeParse(imageId);

    if (!imageIdValidation.success) {
      return apiError('Invalid image ID', 400);
    }

    const existingImage = await prisma.categoryImage.findFirst({
      where: {
        id: imageIdValidation.data,
        categoryId: categoryIdValidation.data
      },
      select: {
        id: true,
        publicId: true
      }
    });

    if (!existingImage) {
      return apiError('Category image not found', 404);
    }

    /*
     * PostgreSQL is the source of truth.
     *
     * Delete the database reference first.
     * Cloudinary cleanup happens afterward.
     *
     * If Cloudinary fails, the publicId is stored in
     * CloudinaryCleanup so it can be retried later.
     */
    await prisma.categoryImage.delete({
      where: {
        id: existingImage.id
      }
    });

    try {
      await deleteCloudinaryImage(existingImage.publicId);

      /*
       * If a previous cleanup entry existed for this
       * asset, it is no longer needed.
       */
      await prisma.cloudinaryCleanup.deleteMany({
        where: {
          publicId: existingImage.publicId
        }
      });
    } catch (cloudinaryError) {
      /*
       * The DB record has already been removed, so the
       * application will never reference this image again.
       *
       * Store the Cloudinary cleanup task for retry.
       */
      try {
        await scheduleCloudinaryCleanup(
          existingImage.publicId,
          cloudinaryError
        );
      } catch (cleanupError) {
        /*
         * Do not turn a successful DB deletion into a
         * failed API response because cleanup scheduling
         * itself failed.
         *
         * Both failures are logged server-side.
         */
        console.error('[CLOUDINARY_CLEANUP_SCHEDULE_FAILED]', cleanupError);
      }

      console.error('[CLOUDINARY_CLEANUP_SCHEDULED]', cloudinaryError);
    }

    return apiSuccess({
      message: 'Category image deleted successfully'
    });
  } catch (error) {
    return serverError(error);
  }
}
