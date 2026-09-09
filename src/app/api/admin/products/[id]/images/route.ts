import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';
import { attachProductImageSchema } from '@/lib/validation/product';
import { verifyCloudinaryAsset } from '@/lib/cloudinary/verify';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';
import {
  scheduleCloudinaryCleanup,
  removeCleanupRecord
} from '@/lib/cloudinary/cleanup';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MAX_IMAGE_COUNT = 50;

async function cleanupOrphanedAsset(publicId: string): Promise<void> {
  try {
    await deleteCloudinaryImage(publicId);
    await removeCleanupRecord(publicId);
  } catch (cloudinaryError) {
    await scheduleCloudinaryCleanup(publicId, cloudinaryError).catch((e) =>
      console.error('[PRODUCT_CLOUDINARY_CLEANUP_SCHEDULE_ERROR]', e)
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const { id } = await context.params;
    const idValidation = cuidSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid product ID', 400);

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(attachProductImageSchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;

    const product = await prisma.product.findUnique({
      where: { id: idValidation.data },
      select: { id: true, _count: { select: { images: true } } }
    });

    if (!product) return apiError('Product not found', 404);

    if (product._count.images >= MAX_IMAGE_COUNT) {
      return apiError(
        `A product can have at most ${MAX_IMAGE_COUNT} images`,
        400
      );
    }

    let cloudinaryImage;
    try {
      cloudinaryImage = await verifyCloudinaryAsset(
        data.publicId,
        'products',
        product.id
      );
    } catch (error) {
      console.error('[CLOUDINARY_IMAGE_VALIDATION_ERROR]', error);
      return apiError('Invalid or unavailable Cloudinary image', 400);
    }

    try {
      const image = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(hashtextextended(${`daily-finds-hub:product-images:${product.id}`}, 0))
        `;

        const currentImageCount = await tx.productImage.count({
          where: { productId: product.id }
        });

        if (currentImageCount >= MAX_IMAGE_COUNT) {
          throw new Error('PRODUCT_IMAGE_LIMIT_REACHED');
        }

        const existingImage = await tx.productImage.findFirst({
          where: {
            productId: product.id,
            publicId: cloudinaryImage.publicId
          },
          select: { id: true }
        });

        if (existingImage) throw new Error('IMAGE_ALREADY_EXISTS');

        if (data.isPrimary) {
          await tx.productImage.updateMany({
            where: { productId: product.id, isPrimary: true },
            data: { isPrimary: false }
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
    } catch (error: unknown) {
      await cleanupOrphanedAsset(cloudinaryImage.publicId);

      if (error instanceof Error) {
        if (error.message === 'PRODUCT_IMAGE_LIMIT_REACHED') {
          return apiError(
            `A product can have at most ${MAX_IMAGE_COUNT} images`,
            400
          );
        }
        if (error.message === 'IMAGE_ALREADY_EXISTS') {
          return apiError('This image is already attached to the product', 409);
        }
      }

      const isPrismaConflict =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002';

      if (isPrismaConflict) {
        return apiError(
          'The image could not be attached due to a conflict',
          409
        );
      }

      throw error;
    }
  } catch (error) {
    return serverError(error);
  }
}
