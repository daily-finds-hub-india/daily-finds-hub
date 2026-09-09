import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiError, apiSuccess, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';
import {
  scheduleCloudinaryCleanup,
  removeCleanupRecord
} from '@/lib/cloudinary/cleanup';
import {
  productIdSchema,
  productImageIdSchema,
  updateProductImageSchema
} from '@/lib/validation/product';

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

    const productIdValidation = productIdSchema.safeParse(id);
    if (!productIdValidation.success)
      return apiError('Invalid product ID', 400);

    const imageIdValidation = productImageIdSchema.safeParse(imageId);
    if (!imageIdValidation.success) return apiError('Invalid image ID', 400);

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(updateProductImageSchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;
    if (Object.keys(data).length === 0)
      return apiError('No fields provided for update', 400);

    const existingImage = await prisma.productImage.findFirst({
      where: {
        id: imageIdValidation.data,
        productId: productIdValidation.data
      },
      select: { id: true, productId: true }
    });

    if (!existingImage) return apiError('Product image not found', 404);

    try {
      const image = await prisma.$transaction(async (tx) => {
        if (data.isPrimary === true) {
          await tx.$executeRaw`
            SELECT pg_advisory_xact_lock(hashtextextended(${`daily-finds-hub:product-images:${existingImage.productId}`}, 0))
          `;

          await tx.productImage.updateMany({
            where: {
              productId: existingImage.productId,
              id: { not: existingImage.id },
              isPrimary: true
            },
            data: { isPrimary: false }
          });
        }

        return tx.productImage.update({
          where: { id: existingImage.id },
          data,
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
    } catch (error: unknown) {
      const isPrismaConflict =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002';

      if (isPrismaConflict) {
        return apiError('Product can have only one primary image', 409);
      }

      const isPrismaNotFound =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025';

      if (isPrismaNotFound) {
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
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const { id, imageId } = await context.params;

    const productIdValidation = productIdSchema.safeParse(id);
    if (!productIdValidation.success)
      return apiError('Invalid product ID', 400);

    const imageIdValidation = productImageIdSchema.safeParse(imageId);
    if (!imageIdValidation.success) return apiError('Invalid image ID', 400);

    const existingImage = await prisma.productImage.findFirst({
      where: {
        id: imageIdValidation.data,
        productId: productIdValidation.data
      },
      select: { id: true, publicId: true }
    });

    if (!existingImage) return apiError('Product image not found', 404);

    await prisma.productImage.delete({
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

    return apiSuccess({ message: 'Product image deleted successfully' });
  } catch (error) {
    return serverError(error);
  }
}
