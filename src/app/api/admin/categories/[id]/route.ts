import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import {
  categoryIdSchema,
  updateCategorySchema
} from '@/lib/validation/category';
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

async function cleanupCategoryCloudinaryImages(
  publicIds: string[]
): Promise<void> {
  const uniquePublicIds = [
    ...new Set(publicIds.map((id) => id.trim()).filter(Boolean))
  ];

  for (const publicId of uniquePublicIds) {
    try {
      await deleteCloudinaryImage(publicId);
      await removeCleanupRecord(publicId);
    } catch (cloudinaryError) {
      await scheduleCloudinaryCleanup(publicId, cloudinaryError).catch((e) =>
        console.error('[CATEGORY_CLOUDINARY_CLEANUP_SCHEDULE_ERROR]', e)
      );
    }
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const { id } = await context.params;
    const idValidation = categoryIdSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid category ID', 400);

    const category = await prisma.category.findUnique({
      where: { id: idValidation.data },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { products: true, images: true } },
        images: {
          orderBy: { displayOrder: 'asc' },
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
          orderBy: { createdAt: 'desc' },
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

    if (!category) return apiError('Category not found', 404);

    return apiSuccess(category);
  } catch (error: unknown) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const { id } = await context.params;
    const idValidation = categoryIdSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid category ID', 400);

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(updateCategorySchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;
    if (Object.keys(data).length === 0)
      return apiError('No fields provided for update', 400);

    const existingCategory = await prisma.category.findUnique({
      where: { id: idValidation.data },
      select: { id: true, name: true, slug: true }
    });

    if (!existingCategory) return apiError('Category not found', 404);

    if (data.name !== undefined || data.slug !== undefined) {
      const conflictConditions = [];
      if (data.name !== undefined) conflictConditions.push({ name: data.name });
      if (data.slug !== undefined) conflictConditions.push({ slug: data.slug });

      const conflictingCategory = await prisma.category.findFirst({
        where: { id: { not: existingCategory.id }, OR: conflictConditions },
        select: { id: true, name: true, slug: true }
      });

      if (conflictingCategory) {
        const nameConflict =
          data.name !== undefined && conflictingCategory.name === data.name;
        return apiError(
          nameConflict
            ? 'A category with this name already exists'
            : 'A category with this slug already exists',
          409
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: existingCategory.id },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return apiSuccess(category);
  } catch (error: unknown) {
    const isPrismaConflict =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002';
    if (isPrismaConflict)
      return apiError('A category with this name or slug already exists', 409);

    const isPrismaNotFound =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025';
    if (isPrismaNotFound) return apiError('Category not found', 404);

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

    const { id } = await context.params;
    const idValidation = categoryIdSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid category ID', 400);

    const category = await prisma.category.findUnique({
      where: { id: idValidation.data },
      select: {
        id: true,
        _count: { select: { products: true } },
        images: { select: { publicId: true } }
      }
    });

    if (!category) return apiError('Category not found', 404);
    if (category._count.products > 0) {
      return apiError(
        'Category cannot be deleted while it contains products',
        409
      );
    }

    const publicIds = category.images.map((image) => image.publicId);

    try {
      await prisma.category.delete({ where: { id: category.id } });
    } catch (error: unknown) {
      const isPrismaNotFound =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025';
      if (isPrismaNotFound) return apiError('Category not found', 404);

      const isPrismaConstraint =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2003';
      if (isPrismaConstraint)
        return apiError(
          'Category cannot be deleted while it contains products',
          409
        );

      throw error;
    }

    await cleanupCategoryCloudinaryImages(publicIds);

    return apiSuccess({ id: category.id, deleted: true });
  } catch (error: unknown) {
    return serverError(error);
  }
}
