// src/app/api/admin/cloudinary/cleanup/route.ts
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { prisma } from '@/lib/prisma';
import { apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { methodNotAllowed, isMethodAllowed } from '@/lib/api/method';
import { processCloudinaryCleanup } from '@/lib/cloudinary/cleanup';

const ALLOWED_METHODS = ['POST'] as const;
const MAX_ITEMS_PER_RUN = 20;

export async function POST(request: Request) {
  if (!isMethodAllowed(request, ALLOWED_METHODS)) {
    return methodNotAllowed([...ALLOWED_METHODS]);
  }

  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const result = await processCloudinaryCleanup(MAX_ITEMS_PER_RUN);
    const remainingCount = await prisma.cloudinaryCleanup.count();

    return apiSuccess({
      message: `Cleanup completed. Successfully removed ${result.deleted} images.${result.failed > 0 ? ` Failed: ${result.failed}` : ''}`,
      successCount: result.deleted,
      failCount: result.failed,
      remainingCount
    });
  } catch (error) {
    return serverError(error);
  }
}
