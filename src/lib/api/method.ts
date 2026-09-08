import { NextResponse } from 'next/server';

export function methodNotAllowed(allowedMethods: string[]) {
  return NextResponse.json(
    {
      error: 'Method not allowed'
    },
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(', ')
      }
    }
  );
}

export function isMethodAllowed(
  request: Request,
  allowedMethods: readonly string[]
) {
  return allowedMethods.includes(request.method);
}
