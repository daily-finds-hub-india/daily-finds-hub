import { NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';
import { validateSameOrigin } from '@/lib/security/csrf';
import { apiError, apiRateLimitError, apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { cloudinary } from '@/lib/cloudinary/server';

export async function POST(request: Request) {
  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) return adminCheck.response;

    const rateLimit = await checkAdminApiRateLimit(adminCheck.admin.id);
    if (!rateLimit.allowed) return apiRateLimitError();

    const csrf = validateSameOrigin(request);
    if (!csrf.allowed) return csrf.response;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder =
      (formData.get('folder') as string) || 'daily-finds-hub/general';

    if (!file) {
      return apiError('No file provided', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error('Upload stream failed'));
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return apiSuccess(
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      },
      201
    );
  } catch (error) {
    return serverError(error);
  }
}
