import { z } from 'zod';

import { apiError } from '@/lib/api/response';

export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      response: apiError('Invalid request data', 400)
    };
  }

  return {
    success: true as const,
    data: result.data
  };
}