import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { createProductSchema } from '@/lib/validation/product';

export async function POST(request: Request) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const parsedBody = await parseJson(request);
    if (!parsedBody.success) return parsedBody.response;

    const validation = validate(createProductSchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;

    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId
      },
      select: {
        id: true
      }
    });

    if (!category) {
      return apiError('Category not found', 404);
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: data.slug
      },
      select: {
        id: true
      }
    });

    if (existingProduct) {
      return apiError('A product with this slug already exists', 409);
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        rating: data.rating,
        reviewCount: data.reviewCount ?? 0,
        amazonUrl: data.amazonUrl,
        asin: data.asin,
        isFeatured: data.isFeatured,
        isTrending: data.isTrending,
        isPublished: data.isPublished
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
        updatedAt: true
      }
    });

    return apiSuccess(product, 201);
  } catch (error) {
    const isPrismaConflict =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002';

    if (isPrismaConflict) {
      return apiError('A product with this slug already exists', 409);
    }

    return serverError(error);
  }
}
