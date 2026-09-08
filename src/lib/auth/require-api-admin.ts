import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkAdminApiRateLimit } from '@/lib/security/admin-api-rate-limit';

export async function requireApiAdmin(request?: Request) {
  /*
   * CSRF / same-origin protection applies to state-changing requests.
   *
   * We only perform this check when a Request object is available.
   * Existing callers that don't yet pass the request continue to
   * receive authentication + authorization protection until migrated.
   */
  if (request) {
    const originCheck = validateSameOrigin(request);

    if (!originCheck.allowed) {
      return {
        authorized: false as const,
        response: originCheck.response
      };
    }
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      username: true,
      isActive: true,
      sessionVersion: true
    }
  });

  if (
    !admin ||
    !admin.isActive ||
    session.user.sessionVersion !== admin.sessionVersion
  ) {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }

  const rateLimitResult = await checkAdminApiRateLimit(admin.id);

  if (!rateLimitResult.allowed) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.max(
                1,
                Math.ceil(
                  (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
                )
              )
            )
          }
        }
      )
    };
  }

  return {
    authorized: true as const,
    admin
  };
}
