import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    !request.auth
  ) {
    const loginUrl = new URL('/admin/login', request.nextUrl.origin);

    loginUrl.searchParams.set('callbackUrl', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*']
};
