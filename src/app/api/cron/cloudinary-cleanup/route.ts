import { NextResponse } from 'next/server';

import { processCloudinaryCleanup } from '@/lib/cloudinary/cleanup';

const MAX_ITEMS_PER_RUN = 20;

function isAuthorizedCronRequest(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return false;
  }

  const expectedValue = `Bearer ${cronSecret}`;

  /*
   * Compare exact strings.
   *
   * The secret itself is never returned in an error response.
   */
  return authorization === expectedValue;
}

export async function GET(request: Request) {
  try {
    /*
     * This endpoint is server-to-server only.
     *
     * Never expose the cleanup worker to the browser without
     * authentication because it can trigger Cloudinary deletion.
     */
    if (!isAuthorizedCronRequest(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        {
          status: 401
        }
      );
    }

    const result = await processCloudinaryCleanup(MAX_ITEMS_PER_RUN);

    return NextResponse.json({
      data: {
        processed: result.processed,
        deleted: result.deleted,
        failed: result.failed
      }
    });
  } catch (error) {
    console.error('[CLOUDINARY_CLEANUP_CRON_ERROR]', error);

    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}
