import { cloudinary } from '@/lib/cloudinary/server';

const MAX_PUBLIC_ID_LENGTH = 500;

function validatePublicId(publicId: string): string {
  const normalized = publicId.trim();

  if (!normalized) {
    throw new Error('Cloudinary public ID is required');
  }

  if (normalized.length > MAX_PUBLIC_ID_LENGTH) {
    throw new Error('Cloudinary public ID is too long');
  }

  return normalized;
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const validatedPublicId = validatePublicId(publicId);

  const result = await cloudinary.uploader.destroy(validatedPublicId, {
    resource_type: 'image',
    invalidate: true
  });

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Failed to delete Cloudinary image: ${result.result}`);
  }
}

export async function deleteCloudinaryImages(
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

  for (const publicId of uniquePublicIds) {
    await deleteCloudinaryImage(publicId);
  }
}
