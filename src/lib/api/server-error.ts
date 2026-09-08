import { NextResponse } from 'next/server';

export function serverError(error: unknown) {
  console.error('[API_ERROR]', error);

  return NextResponse.json(
    {
      error: 'Internal server error'
    },
    {
      status: 500
    }
  );
}
