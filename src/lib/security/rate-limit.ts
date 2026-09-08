import { prisma } from '@/lib/prisma';

interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetAt: Date;
}

export async function rateLimit({
  key,
  limit,
  windowSeconds
}: RateLimitOptions): Promise<RateLimitResult> {
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new Error('Invalid rate-limit configuration');
  }

  if (!Number.isSafeInteger(windowSeconds) || windowSeconds <= 0) {
    throw new Error('Invalid rate-limit window');
  }

  if (!key || key.length > 500) {
    throw new Error('Invalid rate-limit key');
  }

  const now = new Date();
  const windowStart = new Date(
    now.getTime() - (now.getTime() % (windowSeconds * 1000))
  );
  const expiresAt = new Date(windowStart.getTime() + windowSeconds * 1000);

  try {
    const rows = await prisma.$queryRaw<
      Array<{
        count: number;
        expires_at: Date;
      }>
    >`
      INSERT INTO "RateLimit" (
        "key",
        "count",
        "windowStart",
        "expiresAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${key},
        1,
        ${windowStart},
        ${expiresAt},
        NOW(),
        NOW()
      )
      ON CONFLICT ("key")
      DO UPDATE SET
        "count" = CASE
          WHEN "RateLimit"."expiresAt" <= ${now}
            THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "windowStart" = CASE
          WHEN "RateLimit"."expiresAt" <= ${now}
            THEN ${windowStart}
          ELSE "RateLimit"."windowStart"
        END,
        "expiresAt" = CASE
          WHEN "RateLimit"."expiresAt" <= ${now}
            THEN ${expiresAt}
          ELSE "RateLimit"."expiresAt"
        END,
        "updatedAt" = NOW()
      RETURNING
        "count",
        "expiresAt" AS expires_at
    `;

    const row = rows[0];

    if (!row) {
      throw new Error('Rate-limit operation returned no result');
    }

    const count = Number(row.count);

    return {
      allowed: count <= limit,
      count,
      remaining: Math.max(0, limit - count),
      resetAt: row.expires_at
    };
  } catch (error) {
    console.error('[RATE_LIMIT_ERROR]', error);

    // Fail closed.
    throw new Error('Rate-limit service unavailable');
  }
}
