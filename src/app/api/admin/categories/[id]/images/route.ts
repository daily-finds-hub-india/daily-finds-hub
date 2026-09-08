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
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';

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

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

async function scheduleCloudinaryCleanup(
  publicId: string,
  error: unknown
): Promise<void> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    return;
  }

  const errorMessage =
    error instanceof Error ? error.message : 'Cloudinary deletion failed';

  /*
   * Keep cleanup errors bounded so a Cloudinary/API error cannot
   * create an excessively large database value.
   */
  const lastError = errorMessage.slice(0, 2000);

  /*
   * If a cleanup record already exists, increase its attempt
   * count and schedule another retry.
   *
   * The cleanup table uses publicId as a unique key so the same
   * Cloudinary asset cannot create unlimited duplicate cleanup
   * records.
   */
  const existingCleanup = await prisma.cloudinaryCleanup.findUnique({
    where: {
      publicId: normalizedPublicId
    },
    select: {
      id: true,
      attempts: true
    }
  });

  const attempts = (existingCleanup?.attempts ?? 0) + 1;

  const BASE_RETRY_DELAY_MS = 60 * 1000;
  const MAX_RETRY_DELAY_MS = 24 * 60 * 60 * 1000;

  const retryDelay = Math.min(
    BASE_RETRY_DELAY_MS * Math.pow(2, Math.max(0, attempts - 1)),
    MAX_RETRY_DELAY_MS
  );

  const nextRetryAt = new Date(Date.now() + retryDelay);

  await prisma.cloudinaryCleanup.upsert({
    where: {
      publicId: normalizedPublicId
    },
    create: {
      publicId: normalizedPublicId,
      resourceType: 'image',
      attempts,
      nextRetryAt,
      lastError
    },
    update: {
      attempts,
      nextRetryAt,
      lastError
    }
  });
}

async function cleanupOrphanedCloudinaryImage(publicId: string): Promise<void> {
  try {
    /*
     * Attempt immediate deletion first.
     */
    await deleteCloudinaryImage(publicId);

    /*
     * Cloudinary deletion succeeded.
     *
     * Remove any old cleanup record for this asset.
     *
     * This is intentionally outside the try/catch around the
     * Cloudinary deletion. If Cloudinary deletion succeeds but
     * deleting the cleanup record fails, we must NOT treat the
     * Cloudinary deletion itself as failed.
     */
    try {
      await prisma.cloudinaryCleanup.deleteMany({
        where: {
          publicId: publicId.trim()
        }
      });
    } catch (cleanupRecordError) {
      console.error(
        '[CLOUDINARY_CLEANUP_RECORD_DELETE_ERROR]',
        cleanupRecordError
      );
    }
  } catch (cloudinaryError) {
    /*
     * Cloudinary deletion failed.
     *
     * Store the asset in the database so a future cleanup worker
     * can retry it.
     */
    try {
      await scheduleCloudinaryCleanup(publicId, cloudinaryError);

      console.error('[CLOUDINARY_CLEANUP_SCHEDULED]', cloudinaryError);
    } catch (scheduleError) {
      /*
       * Do not hide the original application error if even the
       * cleanup record cannot be created.
       */
      console.error('[CLOUDINARY_CLEANUP_SCHEDULE_ERROR]', scheduleError);
    }
  }
}

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

    /*
     * Early image-count check.
     *
     * This is only an optimization. The authoritative check
     * happens inside the transaction after the advisory lock.
     */
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
     * Verify the Cloudinary asset directly with Cloudinary.
     *
     * This confirms:
     *
     * 1. The asset exists.
     * 2. It is an image.
     * 3. Its public ID belongs to this product's folder.
     * 4. Cloudinary provides a trusted HTTPS URL.
     *
     * The client-provided URL is never trusted.
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
     * Once Cloudinary verification succeeds, this publicId
     * represents an asset that may need cleanup if the DB
     * operation fails.
     */
    let imageWasAttached = false;

    try {
      const image = await prisma.$transaction(async (tx) => {
        /*
         * Serialize image attachments for this specific
         * product.
         */
        await tx.$executeRaw`
            SELECT pg_advisory_xact_lock(
              hashtextextended(
                ${`daily-finds-hub:product-images:${product.id}`},
                0
              )
            )
          `;

        /*
         * Authoritative image-count check.
         */
        const currentImageCount = await tx.productImage.count({
          where: {
            productId: product.id
          }
        });

        if (currentImageCount >= MAX_IMAGE_COUNT) {
          throw new Error('PRODUCT_IMAGE_LIMIT_REACHED');
        }

        /*
         * Prevent duplicate attachment of the same
         * Cloudinary asset.
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

        /*
         * If this image is primary, remove primary status
         * from the previous primary image first.
         *
         * The transaction advisory lock plus the database
         * partial unique index protect this invariant.
         */
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

      imageWasAttached = true;

      return apiSuccess(image, 201);
    } catch (error) {
      /*
       * These two errors mean the Cloudinary asset itself is
       * still valid but could not be attached.
       *
       * Therefore it must be cleaned up.
       */
      if (
        error instanceof Error &&
        error.message === 'PRODUCT_IMAGE_LIMIT_REACHED'
      ) {
        await cleanupOrphanedCloudinaryImage(cloudinaryImage.publicId);

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
        await cleanupOrphanedCloudinaryImage(cloudinaryImage.publicId);

        return NextResponse.json(
          {
            error: 'This image is already attached to the product'
          },
          {
            status: 409
          }
        );
      }

      /*
       * Prisma unique constraint.
       *
       * This can be triggered by the database-level primary
       * image uniqueness constraint or another unique field.
       *
       * The uploaded Cloudinary asset has not been successfully
       * attached, so clean it up.
       */
      if (isPrismaUniqueConstraintError(error)) {
        await cleanupOrphanedCloudinaryImage(cloudinaryImage.publicId);

        return NextResponse.json(
          {
            error:
              'The image could not be attached because it conflicts with an existing image'
          },
          {
            status: 409
          }
        );
      }

      /*
       * Any other database/application failure also means the
       * Cloudinary asset may now be orphaned.
       */
      await cleanupOrphanedCloudinaryImage(cloudinaryImage.publicId);

      throw error;
    } finally {
      /*
       * This variable exists to make the lifecycle explicit.
       *
       * No cleanup is performed here because cleanup must only
       * happen after a failed DB operation. Once attachment
       * succeeds, Cloudinary owns the image and it must remain.
       */
      void imageWasAttached;
    }
  } catch (error) {
    return serverError(error);
  }
}
