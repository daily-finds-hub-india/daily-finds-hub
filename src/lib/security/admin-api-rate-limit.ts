import { rateLimit } from '@/lib/security/rate-limit';

const ADMIN_API_RATE_LIMIT = 120;
const ADMIN_API_WINDOW_SECONDS = 60;

export async function checkAdminApiRateLimit(adminId: string) {
  return rateLimit({
    key: `admin-api:${adminId}`,
    limit: ADMIN_API_RATE_LIMIT,
    windowSeconds: ADMIN_API_WINDOW_SECONDS
  });
}
