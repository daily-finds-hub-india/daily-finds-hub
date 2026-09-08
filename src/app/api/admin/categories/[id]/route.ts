import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { apiSuccess } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import {
  categoryIdSchema,
  updateCategorySchema
} from '@/lib/validation/category';
import { deleteCloudinaryImages } from '@/lib/cloudinary/images';

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
     * Cleanup scheduling is secondary to the original deletion
     * operation. Log the scheduling failure without exposing
     * internal details to the client.
     */
    console.error(
      '[CATEGORY_CLOUDINARY_CLEANUP_SCHEDULE_ERROR]',
      scheduleError
    );
  }
}

async function cleanupCategoryCloudinaryImages(
  publicIds: string[]
): Promise<void> {
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
   * Delete each image independently.
   *
   * This is important because one failed Cloudinary deletion
   * must not prevent the remaining assets from being cleaned up.
   */
  for (const publicId of uniquePublicIds) {
    try {
      await deleteCloudinaryImages([publicId]);

      /*
       * If an old cleanup record exists for this asset, it is
       * no longer needed.
       *
       * Failure to remove the cleanup record must not cause us
       * to treat the successful Cloudinary deletion as failed.
       */
      try {
        await prisma.cloudinaryCleanup.deleteMany({
          where: {
            publicId
          }
        });
      } catch (cleanupRecordError) {
        console.error(
          '[CATEGORY_CLOUDINARY_CLEANUP_RECORD_DELETE_ERROR]',
          cleanupRecordError
        );
      }
    } catch (cloudinaryError) {
      /*
       * Cloudinary deletion failed.
       *
       * The category is already deleted from the database, so
       * the asset must be recorded for future retry.
       */
      await scheduleCloudinaryCleanup(publicId, cloudinaryError);

      console.error('[CATEGORY_CLOUDINARY_CLEANUP_SCHEDULED]', cloudinaryError);
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

    const idValidation = categoryIdSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid category ID'
        },
        {
          status: 400
        }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            products: true,
            images: true
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
        },

        products: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            isPublished: true,
            isFeatured: true,
            isTrending: true
          }
        }
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

    return apiSuccess(category);
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

    const idValidation = categoryIdSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid category ID'
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

    const validation = validate(updateCategorySchema, parsedBody.data);

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

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          error: 'Category not found'
        },
        {
          status: 404
        }
      );
    }

    /*
     * Check name and slug conflicts before updating.
     *
     * The current category is excluded so keeping its existing
     * name or slug does not count as a conflict.
     */
    if (data.name !== undefined || data.slug !== undefined) {
      const conflictConditions = [];

      if (data.name !== undefined) {
        conflictConditions.push({
          name: data.name
        });
      }

      if (data.slug !== undefined) {
        conflictConditions.push({
          slug: data.slug
        });
      }

      const conflictingCategory = await prisma.category.findFirst({
        where: {
          id: {
            not: existingCategory.id
          },
          OR: conflictConditions
        },
        select: {
          id: true,
          name: true,
          slug: true
        }
      });

      if (conflictingCategory) {
        const nameConflict =
          data.name !== undefined && conflictingCategory.name === data.name;

        return NextResponse.json(
          {
            error: nameConflict
              ? 'A category with this name already exists'
              : 'A category with this slug already exists'
          },
          {
            status: 409
          }
        );
      }
    }

    const updateData: {
      name?: string;
      slug?: string;
      description?: string;
      isFeatured?: boolean;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.slug !== undefined) {
      updateData.slug = data.slug;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }

    const category = await prisma.category.update({
      where: {
        id: existingCategory.id
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return apiSuccess(category);
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      return NextResponse.json(
        {
          error: 'A category with this name or slug already exists'
        },
        {
          status: 409
        }
      );
    }

    if (isPrismaError(error, 'P2025')) {
      return NextResponse.json(
        {
          error: 'Category not found'
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

    const idValidation = categoryIdSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid category ID'
        },
        {
          status: 400
        }
      );
    }

    /*
     * Fetch the category, its products count, and all
     * Cloudinary public IDs BEFORE deleting the category.
     *
     * CategoryImage uses onDelete: Cascade, so once the
     * category is deleted, these database rows disappear.
     */
    const category = await prisma.category.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        _count: {
          select: {
            products: true
          }
        },
        images: {
          select: {
            publicId: true
          }
        }
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

    /*
     * Product.category uses onDelete: Restrict.
     *
     * Never delete a category that still contains products.
     */
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: 'Category cannot be deleted while it contains products'
        },
        {
          status: 409
        }
      );
    }

    const publicIds = category.images.map((image) => image.publicId);

    /*
     * Delete the database record FIRST.
     *
     * This establishes the database as the source of truth:
     *
     * - If the DB deletion succeeds, the category and its image
     *   records are gone.
     * - Cloudinary cleanup happens afterward.
     * - Any Cloudinary failure is recoverable through
     *   CloudinaryCleanup.
     *
     * We intentionally do NOT keep a database transaction open
     * while making external Cloudinary API calls.
     */
    try {
      await prisma.category.delete({
        where: {
          id: category.id
        }
      });
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return NextResponse.json(
          {
            error: 'Category not found'
          },
          {
            status: 404
          }
        );
      }

      if (isPrismaError(error, 'P2003')) {
        return NextResponse.json(
          {
            error: 'Category cannot be deleted while it contains products'
          },
          {
            status: 409
          }
        );
      }

      throw error;
    }

    /*
     * The category is now successfully deleted from the DB.
     *
     * Clean up its Cloudinary assets independently.
     *
     * A Cloudinary failure does NOT roll back the DB deletion
     * because Cloudinary and PostgreSQL cannot participate in
     * one atomic transaction.
     */
    await cleanupCategoryCloudinaryImages(publicIds);

    return apiSuccess({
      id: category.id,
      deleted: true
    });
  } catch (error) {
    return serverError(error);
  }
}
