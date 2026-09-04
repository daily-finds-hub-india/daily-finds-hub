import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';

const FOLDER_BY_TYPE = {
  products: 'daily-finds-hub/products/',
  categories: 'daily-finds-hub/categories/'
} as const;

export async function POST(request: Request) {
  const { response } = await requireApiAdmin();
  if (response) return response;

  try {
    const body: unknown = await request.json();
    const type =
      typeof body === 'object' && body !== null && 'type' in body
        ? body.type
        : undefined;
    const publicId =
      typeof body === 'object' && body !== null && 'publicId' in body
        ? body.publicId
        : undefined;

    if (
      (type !== 'products' && type !== 'categories') ||
      typeof publicId !== 'string' ||
      !publicId.startsWith(FOLDER_BY_TYPE[type]) ||
      publicId.length > 300
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid Cloudinary image.' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clean up Cloudinary image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clean up Cloudinary image.' },
      { status: 500 }
    );
  }
}
