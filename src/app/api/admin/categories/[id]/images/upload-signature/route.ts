import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { apiSuccess } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { cuidSchema } from '@/lib/validation/common';
import { cloudinary } from '@/lib/cloudinary/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MAX_IMAGE_COUNT = 20;
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_FORMATS = 'jpg,jpeg,png,webp';

export async function POST(request: Request, context: RouteContext) {
  try {
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const { id } = await context.params;

    const idValidation = cuidSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid category ID'
        },
        {
          status: 400
        }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: idValidation.data
      },
      select: {
        id: true,
        _count: {
          select: {
            images: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        {
          error: 'Category not found'
        },
        {
          status: 404
        }
      );
    }

    if (category._count.images >= MAX_IMAGE_COUNT) {
      return NextResponse.json(
        {
          error: `A category can have at most ${MAX_IMAGE_COUNT} images`
        },
        {
          status: 400
        }
      );
    }

    const folder = `daily-finds-hub/categories/${category.id}`;

    const timestamp = Math.floor(Date.now() / 1000);

    const uploadParameters = {
      allowed_formats: ALLOWED_IMAGE_FORMATS,
      folder,
      max_file_size: MAX_IMAGE_FILE_SIZE,
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
      folder,
      allowedFormats: ALLOWED_IMAGE_FORMATS.split(','),
      maxFileSize: MAX_IMAGE_FILE_SIZE
    });
  } catch (error) {
    return serverError(error);
  }
}
