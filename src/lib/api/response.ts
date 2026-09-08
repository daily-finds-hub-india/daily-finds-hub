import { NextResponse } from 'next/server';

export function apiError(message: string, status: number) {
  return NextResponse.json(
    {
      error: message
    },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      data
    },
    { status }
  );
}

export function apiRateLimitError() {
  return NextResponse.json(
    {
      error: 'Too many requests'
    },
    {
      status: 429
    }
  );
}
