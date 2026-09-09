import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { productIdSchema, updateProductSchema } from '@/lib/validation/product';
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

async function cleanupProductCloudinaryImages(
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
        console.error('[PRODUCT_CLOUDINARY_CLEANUP_SCHEDULE_ERROR]', e)
      );
    }
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
    const idValidation = productIdSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid product ID', 400);

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(updateProductSchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;
    if (Object.keys(data).length === 0)
      return apiError('No fields provided for update', 400);

    const existingProduct = await prisma.product.findUnique({
      where: { id: idValidation.data },
      select: {
        id: true,
        price: true,
        originalPrice: true,
        categoryId: true
      }
    });

    if (!existingProduct) return apiError('Product not found', 404);

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
      return apiError(
        'Original price must be greater than or equal to price',
        400
      );
    }

    if (
      data.categoryId !== undefined &&
      data.categoryId !== existingProduct.categoryId
    ) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true }
      });

      if (!category) return apiError('Category not found', 404);
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

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.shortDescription !== undefined)
      updateData.shortDescription = data.shortDescription;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined)
      updateData.originalPrice = data.originalPrice;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.reviewCount !== undefined)
      updateData.reviewCount = data.reviewCount;
    if (data.amazonUrl !== undefined) updateData.amazonUrl = data.amazonUrl;
    if (data.asin !== undefined) updateData.asin = data.asin;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isTrending !== undefined) updateData.isTrending = data.isTrending;
    if (data.isPublished !== undefined)
      updateData.isPublished = data.isPublished;

    const product = await prisma.product.update({
      where: { id: existingProduct.id },
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
  } catch (error: unknown) {
    const isPrismaConflict =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002';
    if (isPrismaConflict)
      return apiError('A product with this slug already exists', 409);

    const isPrismaNotFound =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025';
    if (isPrismaNotFound) return apiError('Product not found', 404);

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
    const idValidation = productIdSchema.safeParse(id);
    if (!idValidation.success) return apiError('Invalid product ID', 400);

    const product = await prisma.product.findUnique({
      where: { id: idValidation.data },
      select: {
        id: true,
        images: { select: { publicId: true } }
      }
    });

    if (!product) return apiError('Product not found', 404);

    const publicIds = product.images.map((image) => image.publicId);

    try {
      await prisma.product.delete({ where: { id: product.id } });
    } catch (error: unknown) {
      const isPrismaNotFound =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025';
      if (isPrismaNotFound) return apiError('Product not found', 404);

      throw error;
    }

    await cleanupProductCloudinaryImages(publicIds);

    return apiSuccess({ id: product.id, deleted: true });
  } catch (error: unknown) {
    return serverError(error);
  }
}
