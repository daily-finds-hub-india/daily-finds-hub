import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { serverError } from '@/lib/api/server-error';
import {
  createCategorySchema,
  categoryQuerySchema
} from '@/lib/validation/category';

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

export async function GET(request: Request) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const { searchParams } = new URL(request.url);

    const validation = validate(categoryQuerySchema, {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      featured: searchParams.get('featured') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      direction: searchParams.get('direction') ?? undefined
    });

    if (!validation.success) return validation.response;

    const { page, pageSize, search, featured, sort, direction } =
      validation.data;

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const }
              }
            ]
          }
        : {}),
      ...(featured !== undefined ? { isFeatured: featured === 'true' } : {})
    };

    const sortField = {
      newest: 'createdAt',
      oldest: 'createdAt',
      name: 'name'
    }[sort];

    const sortDirection = sort === 'oldest' ? 'asc' : direction;
    const orderBy = { [sortField]: sortDirection };
    const skip = (page - 1) * pageSize;

    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isFeatured: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { products: true, images: true }
          },
          images: {
            orderBy: { displayOrder: 'asc' },
            select: {
              id: true,
              url: true,
              altText: true,
              displayOrder: true,
              isPrimary: true
            }
          }
        }
      }),
      prisma.category.count({ where })
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return apiSuccess({
      items: categories,
      pagination: { page, pageSize, total, totalPages }
    });
  } catch (error: unknown) {
    return serverError(error);
  }
}
