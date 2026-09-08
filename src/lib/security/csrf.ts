import { NextResponse } from 'next/server';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

function getExpectedOrigin(request: Request): string | null {
  const configuredOrigin = process.env.APP_URL?.trim();

  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).origin;
    } catch {
      return null;
    }
  }

  /*
   * Local development fallback.
   *
   * We only use the request origin when APP_URL is not configured.
   * Production should have APP_URL explicitly configured.
   */
  if (process.env.NODE_ENV !== 'production') {
    return new URL(request.url).origin;
  }

  return null;
}

export function validateSameOrigin(request: Request) {
  if (SAFE_METHODS.has(request.method)) {
    return {
      allowed: true as const
    };
  }

  const expectedOrigin = getExpectedOrigin(request);

  if (!expectedOrigin) {
    return {
      allowed: false as const,
      response: forbidden()
    };
  }

  /*
   * Fetch Metadata gives us an additional browser-level signal.
   * A cross-site request must never be allowed to mutate admin data.
   */
  const fetchSite = request.headers.get('sec-fetch-site');

  if (fetchSite === 'cross-site') {
    return {
      allowed: false as const,
      response: forbidden()
    };
  }

  /*
   * Origin is the primary check for state-changing requests.
   */
  const origin = request.headers.get('origin');

  if (origin) {
    if (origin !== expectedOrigin) {
      return {
        allowed: false as const,
        response: forbidden()
      };
    }

    return {
      allowed: true as const
    };
  }

  /*
   * Some legitimate requests may not contain Origin.
   * Referer provides a fallback.
   */
  const referer = request.headers.get('referer');

  if (referer) {
    try {
      if (new URL(referer).origin !== expectedOrigin) {
        return {
          allowed: false as const,
          response: forbidden()
        };
      }

      return {
        allowed: true as const
      };
    } catch {
      return {
        allowed: false as const,
        response: forbidden()
      };
    }
  }

  /*
   * Admin mutations fail closed when neither Origin nor Referer
   * identifies the request as same-origin.
   */
  return {
    allowed: false as const,
    response: forbidden()
  };
}
