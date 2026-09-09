import { z } from 'zod';
import { cuidSchema } from '@/lib/validation/common';

export const createCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      ),
    description: z.string().trim().min(1).max(1000),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true)
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      )
      .optional(),
    description: z.string().trim().max(1000).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional()
  })
  .strict();

export const categoryIdSchema = cuidSchema;
export const categoryImageIdSchema = cuidSchema;

export const categoryQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    featured: z.enum(['true', 'false']).optional(),
    sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
    direction: z.enum(['asc', 'desc']).default('desc')
  })
  .strict();

export const attachCategoryImageSchema = z
  .object({
    url: z.string().url().max(2048),
    publicId: z.string().min(1).max(500),
    altText: z.string().trim().max(200).default('Category image'),
    isPrimary: z.boolean().default(false)
  })
  .strict();

export const updateCategoryImageSchema = z
  .object({
    altText: z.string().trim().max(200).optional(),
    displayOrder: z.number().int().min(0).optional(),
    isPrimary: z.boolean().optional()
  })
  .strict();
