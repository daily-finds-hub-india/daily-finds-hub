import { NextResponse } from 'next/server';

const MAX_JSON_BODY_BYTES = 1 * 1024 * 1024; // 1 MB

export async function parseJson(request: Request) {
  const contentType = request.headers.get('content-type');

  if (!contentType?.toLowerCase().startsWith('application/json')) {
    return {
      success: false as const,
      response: NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    };
  }

  const contentLength = request.headers.get('content-length');

  if (contentLength !== null) {
    const length = Number(contentLength);

    if (
      !Number.isSafeInteger(length) ||
      length < 0 ||
      length > MAX_JSON_BODY_BYTES
    ) {
      return {
        success: false as const,
        response: NextResponse.json(
          { error: 'Request body too large' },
          { status: 413 }
        )
      };
    }
  }

  try {
    const data = await request.json();

    return {
      success: true as const,
      data
    };
  } catch {
    return {
      success: false as const,
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    };
  }
}
