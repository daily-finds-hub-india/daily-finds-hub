import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
  const { pathname, search } = request.nextUrl;

  const isLoginRoute = pathname === '/admin/login';

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  const isAuthenticated = Boolean(request.auth?.user);

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
  }

  if (isAdminRoute && !isLoginRoute && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.nextUrl.origin);

    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*']
};
