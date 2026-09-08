import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { apiSuccess } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';
import { updateProductSchema } from '@/lib/validation/product';
import { deleteCloudinaryImage } from '@/lib/cloudinary/images';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MAX_CLEANUP_ERROR_LENGTH = 2000;
const BASE_RETRY_DELAY_MS = 60 * 1000;
const MAX_RETRY_DELAY_MS = 24 * 60 * 60 * 1000;

function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
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

  const lastError = errorMessage.slice(0, MAX_CLEANUP_ERROR_LENGTH);

  try {
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
  } catch (scheduleError) {
    /*
     * Cleanup scheduling is a recovery mechanism. If even the
     * recovery record cannot be created, log it without exposing
     * internal details to the client.
     */
    console.error('[PRODUCT_CLOUDINARY_CLEANUP_SCHEDULE_ERROR]', scheduleError);
  }
}

async function cleanupCloudinaryImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) {
    return;
  }

  const uniquePublicIds = [
    ...new Set(
      publicIds
        .map((publicId) => publicId.trim())
        .filter((publicId) => publicId.length > 0)
    )
  ];

  /*
   * Process each Cloudinary asset independently.
   *
   * If one deletion fails, the remaining images still get a
   * chance to be deleted.
   */
  for (const publicId of uniquePublicIds) {
    try {
      await deleteCloudinaryImage(publicId);

      /*
       * The Cloudinary deletion succeeded.
       *
       * Remove any stale cleanup record for this asset.
       *
       * This is deliberately separate from the Cloudinary
       * deletion try/catch. A database failure here must not
       * cause us to incorrectly retry an already-deleted asset.
       */
      try {
        await prisma.cloudinaryCleanup.deleteMany({
          where: {
            publicId
          }
        });
      } catch (cleanupRecordError) {
        console.error(
          '[PRODUCT_CLOUDINARY_CLEANUP_RECORD_DELETE_ERROR]',
          cleanupRecordError
        );
      }
    } catch (cloudinaryError) {
      /*
       * The database record has already been deleted.
       *
       * Cloudinary cleanup failed, so make the asset recoverable
       * through the cleanup table.
       */
      await scheduleCloudinaryCleanup(publicId, cloudinaryError);

      console.error('[PRODUCT_CLOUDINARY_CLEANUP_SCHEDULED]', cloudinaryError);
    }
  }
}

export async function GET(request: Request, context: RouteContext) {
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

    const product = await prisma.product.findUnique({
      where: {
        id: idValidation.data
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
            isPrimary: true,
            createdAt: true
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

export async function PATCH(request: Request, context: RouteContext) {
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

    const validation = validate(updateProductSchema, parsedBody.data);

    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error: 'No fields provided for update'
        },
        {
          status: 400
        }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        price: true,
        originalPrice: true,
        categoryId: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: 'Product not found'
        },
        {
          status: 404
        }
      );
    }

    const finalPrice =
      data.price !== undefined ? data.price : Number(existingProduct.price);

    const finalOriginalPrice =
      data.originalPrice !== undefined
        ? data.originalPrice
        : existingProduct.originalPrice !== null
          ? Number(existingProduct.originalPrice)
          : undefined;

    if (
      finalOriginalPrice !== undefined &&
      finalOriginalPrice !== null &&
      finalOriginalPrice < finalPrice
    ) {
      return NextResponse.json(
        {
          error: 'Original price must be greater than or equal to price'
        },
        {
          status: 400
        }
      );
    }

    if (
      data.categoryId !== undefined &&
      data.categoryId !== existingProduct.categoryId
    ) {
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
    }

    const updateData: {
      name?: string;
      slug?: string;
      shortDescription?: string;
      description?: string;
      categoryId?: string;
      price?: number;
      originalPrice?: number | null;
      rating?: number | null;
      reviewCount?: number;
      amazonUrl?: string | null;
      asin?: string | null;
      isFeatured?: boolean;
      isTrending?: boolean;
      isPublished?: boolean;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.slug !== undefined) {
      updateData.slug = data.slug;
    }

    if (data.shortDescription !== undefined) {
      updateData.shortDescription = data.shortDescription;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId;
    }

    if (data.price !== undefined) {
      updateData.price = data.price;
    }

    if (data.originalPrice !== undefined) {
      updateData.originalPrice = data.originalPrice;
    }

    if (data.rating !== undefined) {
      updateData.rating = data.rating;
    }

    if (data.reviewCount !== undefined) {
      updateData.reviewCount = data.reviewCount;
    }

    if (data.amazonUrl !== undefined) {
      updateData.amazonUrl = data.amazonUrl;
    }

    if (data.asin !== undefined) {
      updateData.asin = data.asin;
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }

    if (data.isTrending !== undefined) {
      updateData.isTrending = data.isTrending;
    }

    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
    }

    const product = await prisma.product.update({
      where: {
        id: existingProduct.id
      },
      data: updateData,
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

    return apiSuccess(product);
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      return NextResponse.json(
        {
          error: 'A product with this slug already exists'
        },
        {
          status: 409
        }
      );
    }

    if (isPrismaError(error, 'P2025')) {
      return NextResponse.json(
        {
          error: 'Product not found'
        },
        {
          status: 404
        }
      );
    }

    return serverError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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

    /*
     * Fetch the product and its Cloudinary public IDs BEFORE
     * deleting the database record.
     *
     * ProductImage rows use onDelete: Cascade, so the public
     * IDs would otherwise be lost after the DB deletion.
     */
    const product = await prisma.product.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        images: {
          select: {
            publicId: true
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

    const publicIds = product.images.map((image) => image.publicId);

    /*
     * Delete the database record FIRST.
     *
     * PostgreSQL is the source of truth.
     *
     * ProductImage rows are automatically removed because their
     * relation uses onDelete: Cascade.
     *
     * We deliberately do NOT call Cloudinary while a database
     * transaction is open. PostgreSQL and Cloudinary cannot
     * participate in one atomic transaction.
     */
    try {
      await prisma.product.delete({
        where: {
          id: product.id
        }
      });
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return NextResponse.json(
          {
            error: 'Product not found'
          },
          {
            status: 404
          }
        );
      }

      throw error;
    }

    /*
     * The product and its DB image records are now gone.
     *
     * Clean up Cloudinary independently.
     *
     * If Cloudinary is unavailable or deletion fails, the
     * cleanup record preserves enough information for a future
     * retry worker to remove the orphaned asset.
     */
    await cleanupCloudinaryImages(publicIds);

    return apiSuccess({
      id: product.id,
      deleted: true
    });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return NextResponse.json(
        {
          error: 'Product not found'
        },
        {
          status: 404
        }
      );
    }

    return serverError(error);
  }
}
