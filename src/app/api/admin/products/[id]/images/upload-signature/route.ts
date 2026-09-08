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

const MAX_IMAGE_COUNT = 50;
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_FORMATS = 'jpg,jpeg,png,webp';

export async function POST(request: Request, context: RouteContext) {
  try {
    /*
     * Require an authenticated and active admin.
     *
     * Passing the request is important because requireApiAdmin
     * also performs same-origin protection and admin API
     * rate limiting.
     */
    const adminCheck = await requireApiAdmin(request);

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const { id } = await context.params;

    /*
     * Validate the product ID before using it anywhere else.
     */
    const idValidation = cuidSchema.safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid product ID'
        },
        {
          status: 400
        }
      );
    }

    /*
     * Make sure the product exists and retrieve the current
     * number of attached images.
     */
    const product = await prisma.product.findUnique({
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

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found'
        },
        {
          status: 404
        }
      );
    }

    /*
     * This is only an early/optimization check.
     *
     * It is NOT the authoritative concurrency protection because
     * another request could upload/attach an image immediately
     * after this check.
     *
     * The authoritative limit is enforced again by the image
     * attachment route using a PostgreSQL advisory transaction lock.
     */
    if (product._count.images >= MAX_IMAGE_COUNT) {
      return NextResponse.json(
        {
          error: `A product can have at most ${MAX_IMAGE_COUNT} images`
        },
        {
          status: 400
        }
      );
    }

    /*
     * Every upload is scoped to this exact product.
     *
     * The client does not get to choose an arbitrary Cloudinary
     * folder.
     */
    const folder = `daily-finds-hub/products/${product.id}`;

    /*
     * Cloudinary signatures include a timestamp.
     *
     * The timestamp is generated server-side so the client cannot
     * control the signed timestamp.
     */
    const timestamp = Math.floor(Date.now() / 1000);

    /*
     * These parameters are signed by our Cloudinary API secret.
     *
     * The browser must send these exact values when performing
     * the signed upload.
     */
    const uploadParameters = {
      allowed_formats: ALLOWED_IMAGE_FORMATS,
      folder,
      max_file_size: MAX_IMAGE_FILE_SIZE,
      timestamp
    };

    /*
     * Never expose CLOUDINARY_API_SECRET to the browser.
     *
     * Only the server generates the signature.
     */
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
