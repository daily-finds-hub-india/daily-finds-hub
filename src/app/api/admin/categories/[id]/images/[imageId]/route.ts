import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiError, apiSuccess, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import {
  categoryIdSchema,
  categoryImageIdSchema,
  updateCategoryImageSchema
} from '@/lib/validation/category';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';
import {
  scheduleCloudinaryCleanup,
  removeCleanupRecord
} from '@/lib/cloudinary/cleanup';

interface RouteContext {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const { id, imageId } = await context.params;

    const categoryIdValidation = categoryIdSchema.safeParse(id);
    if (!categoryIdValidation.success)
      return apiError('Invalid category ID', 400);

    const imageIdValidation = categoryImageIdSchema.safeParse(imageId);
    if (!imageIdValidation.success) return apiError('Invalid image ID', 400);

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(updateCategoryImageSchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;
    if (Object.keys(data).length === 0)
      return apiError('No fields provided for update', 400);

    const existingImage = await prisma.categoryImage.findFirst({
      where: {
        id: imageIdValidation.data,
        categoryId: categoryIdValidation.data
      },
      select: { id: true, categoryId: true }
    });

    if (!existingImage) return apiError('Category image not found', 404);

    try {
      const image = await prisma.$transaction(async (tx) => {
        if (data.isPrimary === true) {
          await tx.$executeRaw`
            SELECT pg_advisory_xact_lock(hashtextextended(${`daily-finds-hub:category-images:${existingImage.categoryId}`}, 0))
          `;

          await tx.categoryImage.updateMany({
            where: {
              categoryId: existingImage.categoryId,
              id: { not: existingImage.id },
              isPrimary: true
            },
            data: { isPrimary: false }
          });
        }

        return tx.categoryImage.update({
          where: { id: existingImage.id },
          data,
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
    } catch (error: unknown) {
      const isPrismaConflict =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002';

      if (isPrismaConflict) {
        return apiError('Category can have only one primary image', 409);
      }

      const isPrismaNotFound =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025';

      if (isPrismaNotFound) {
        return apiError('Category image not found', 404);
      }

      throw error;
    }
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const { id, imageId } = await context.params;

    const categoryIdValidation = categoryIdSchema.safeParse(id);
    if (!categoryIdValidation.success)
      return apiError('Invalid category ID', 400);

    const imageIdValidation = categoryImageIdSchema.safeParse(imageId);
    if (!imageIdValidation.success) return apiError('Invalid image ID', 400);

    const existingImage = await prisma.categoryImage.findFirst({
      where: {
        id: imageIdValidation.data,
        categoryId: categoryIdValidation.data
      },
      select: { id: true, publicId: true }
    });

    if (!existingImage) return apiError('Category image not found', 404);

    await prisma.categoryImage.delete({
      where: { id: existingImage.id }
    });

    try {
      await deleteCloudinaryImage(existingImage.publicId);
      await removeCleanupRecord(existingImage.publicId);
    } catch (cloudinaryError) {
      await scheduleCloudinaryCleanup(
        existingImage.publicId,
        cloudinaryError
      ).catch((e) => console.error('[CLOUDINARY_CLEANUP_SCHEDULE_FAILED]', e));
    }

    return apiSuccess({ message: 'Category image deleted successfully' });
  } catch (error) {
    return serverError(error);
  }
}
