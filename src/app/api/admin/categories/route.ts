import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import { createCategorySchema } from '@/lib/validation/category';

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

    const validation = validate(createCategorySchema, parsedBody.data);
    if (!validation.success) return validation.response;

    const data = validation.data;

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }]
      },
      select: { id: true, name: true, slug: true }
    });

    if (existingCategory) {
      const conflict = existingCategory.slug === data.slug ? 'slug' : 'name';
      return apiError(`A category with this ${conflict} already exists`, 409);
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished
      },
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

    return apiSuccess(category, 201);
  } catch (error: unknown) {
    const isPrismaConflict =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002';

    if (isPrismaConflict) {
      return apiError('A category with this name or slug already exists', 409);
    }

    return serverError(error);
  }
}
