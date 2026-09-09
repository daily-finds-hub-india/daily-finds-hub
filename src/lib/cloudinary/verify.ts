import { cloudinary } from '@/lib/cloudinary/server';

const MAX_PUBLIC_ID_LENGTH = 500;

export async function verifyCloudinaryAsset(
  publicId: string,
  entityType: 'categories' | 'products',
  entityId: string
) {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Cloudinary public ID is required');
  }

  if (normalizedPublicId.length > MAX_PUBLIC_ID_LENGTH) {
    throw new Error('Cloudinary public ID is too long');
  }

  const expectedFolder = `daily-finds-hub/${entityType}/${entityId}/`;

  if (!normalizedPublicId.startsWith(expectedFolder)) {
    throw new Error(
      `Invalid Cloudinary image reference. Must belong to ${expectedFolder}`
    );
  }

  try {
    const resource = await cloudinary.api.resource(normalizedPublicId, {
      resource_type: 'image'
    });

    if (resource.resource_type !== 'image') {
      throw new Error('Cloudinary asset is not an image');
    }

    if (resource.public_id !== normalizedPublicId) {
      throw new Error('Cloudinary public ID mismatch');
    }

    if (!resource.secure_url) {
      throw new Error('Cloudinary image URL is unavailable');
    }

    return {
      publicId: resource.public_id,
      url: resource.secure_url
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Invalid Cloudinary image reference') ||
        error.message === 'Cloudinary asset is not an image' ||
        error.message === 'Cloudinary public ID mismatch' ||
        error.message === 'Cloudinary image URL is unavailable'
      ) {
        throw error;
      }
    }

    throw new Error('Cloudinary image could not be verified');
  }
}
