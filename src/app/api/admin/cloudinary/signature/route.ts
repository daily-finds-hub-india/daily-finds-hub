import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { cloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

const ALLOWED_FOLDERS = {
  products: 'daily-finds-hub/products',
  categories: 'daily-finds-hub/categories'
} as const;

export async function POST(request: Request) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  try {
    const body: unknown = await request.json();

    const type =
      typeof body === 'object' && body !== null && 'type' in body
        ? body.type
        : undefined;

    if (type !== 'products' && type !== 'categories') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid upload type.'
        },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = ALLOWED_FOLDERS[type];

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to create upload signature.'
      },
      { status: 500 }
    );
  }
}
