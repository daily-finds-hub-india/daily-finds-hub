import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';
import { getClientIp } from '@/lib/security/client-ip';

export default auth(async (request) => {
  const { pathname, search } = request.nextUrl;

  // Rate-limit API authentication requests to prevent brute-force attacks
  if (pathname.startsWith('/api/auth')) {
    const clientIp = getClientIp(request);

    try {
      const limitResult = await rateLimit({
        key: `api:auth:ip:${clientIp}`,
        limit: 15,
        windowSeconds: 60
      });

      if (!limitResult.allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
    } catch (error) {
      console.error('[MIDDLEWARE_RATE_LIMIT_ERROR]', error);
      // Fail closed or permit depending on strictness
    }
  }

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
  matcher: ['/admin/:path*', '/api/auth/:path*']
};
