import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiSuccess, apiError, apiRateLimitError } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';
import { cloudinary } from '@/lib/cloudinary/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MAX_IMAGE_COUNT = 50;

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
    if (!idValidation.success) return apiError('Invalid category ID', 400);

    const category = await prisma.category.findUnique({
      where: { id: idValidation.data },
      select: { id: true, _count: { select: { images: true } } }
    });

    if (!category) return apiError('Category not found', 404);

    if (category._count.images >= MAX_IMAGE_COUNT) {
      return apiError(
        `A category can have at most ${MAX_IMAGE_COUNT} images`,
        400
      );
    }

    const folder = `daily-finds-hub/categories/${category.id}`;
    const timestamp = Math.floor(Date.now() / 1000);

    // Keep payload strictly to timestamp and folder to avoid signature mismatch
    const uploadParameters = {
      folder,
      timestamp
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParameters,
      process.env.CLOUDINARY_API_SECRET!
    );

    return apiSuccess({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder
    });
  } catch (error) {
    return serverError(error);
  }
}
