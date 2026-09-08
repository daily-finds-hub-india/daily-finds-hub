import { prisma } from '@/lib/prisma';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';

const BASE_RETRY_DELAY_MS = 60 * 1000;
const MAX_RETRY_DELAY_MS = 24 * 60 * 60 * 1000;
const MAX_ERROR_LENGTH = 2000;

function getRetryDelay(attempts: number): number {
  return Math.min(
    BASE_RETRY_DELAY_MS * Math.pow(2, Math.max(0, attempts - 1)),
    MAX_RETRY_DELAY_MS
  );
}

export async function scheduleCloudinaryCleanup(
  publicId: string,
  error?: unknown
): Promise<void> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    return;
  }

  const errorMessage =
    error instanceof Error ? error.message : 'Cloudinary deletion failed';

  const lastError = errorMessage.slice(0, MAX_ERROR_LENGTH);

  /*
   * Use an upsert because publicId is unique.
   *
   * This prevents multiple cleanup records for the same
   * Cloudinary asset.
   */
  const existing = await prisma.cloudinaryCleanup.findUnique({
    where: {
      publicId: normalizedPublicId
    },
    select: {
      attempts: true
    }
  });

  const attempts = (existing?.attempts ?? 0) + 1;

  const nextRetryAt = new Date(Date.now() + getRetryDelay(attempts));

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

export async function removeCleanupRecord(publicId: string): Promise<void> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    return;
  }

  await prisma.cloudinaryCleanup.deleteMany({
    where: {
      publicId: normalizedPublicId
    }
  });
}

export async function processCloudinaryCleanup(limit = 20): Promise<{
  processed: number;
  deleted: number;
  failed: number;
}> {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 100);

  const cleanupItems = await prisma.cloudinaryCleanup.findMany({
    where: {
      nextRetryAt: {
        lte: new Date()
      }
    },
    orderBy: {
      nextRetryAt: 'asc'
    },
    take: safeLimit,
    select: {
      id: true,
      publicId: true,
      attempts: true
    }
  });

  let deleted = 0;
  let failed = 0;

  for (const item of cleanupItems) {
    try {
      await deleteCloudinaryImage(item.publicId);

      /*
       * Cloudinary deletion succeeded.
       *
       * Remove the cleanup record so it is not processed again.
       */
      await prisma.cloudinaryCleanup.delete({
        where: {
          id: item.id
        }
      });

      deleted++;
    } catch (error) {
      failed++;

      const attempts = item.attempts + 1;

      const nextRetryAt = new Date(Date.now() + getRetryDelay(attempts));

      const errorMessage =
        error instanceof Error ? error.message : 'Cloudinary deletion failed';

      /*
       * Update the existing record instead of creating another
       * record for the same publicId.
       */
      try {
        await prisma.cloudinaryCleanup.update({
          where: {
            id: item.id
          },
          data: {
            attempts,
            nextRetryAt,
            lastError: errorMessage.slice(0, MAX_ERROR_LENGTH)
          }
        });
      } catch (updateError) {
        /*
         * If the cleanup record disappeared between findMany
         * and update, another worker may already have processed
         * it. Log the error but don't expose internals.
         */
        console.error('[CLOUDINARY_CLEANUP_UPDATE_ERROR]', updateError);
      }

      console.error('[CLOUDINARY_CLEANUP_RETRY_FAILED]', error);
    }
  }

  return {
    processed: cleanupItems.length,
    deleted,
    failed
  };
}
