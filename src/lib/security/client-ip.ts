export function getClientIp(request: Request): string {
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');

  if (vercelForwardedFor) {
    const ip = vercelForwardedFor.split(',')[0]?.trim();

    if (ip) {
      return ip;
    }
  }

  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0]?.trim();

    if (ip) {
      return ip;
    }
  }

  return 'unknown';
}
