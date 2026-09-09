import { z } from 'zod';

import { cuidSchema } from '@/lib/validation/common';

const MAX_PRICE = 99_999_999.99;

const amazonUrlSchema = z
  .string()
  .trim()
  .url()
  .max(2048)
  .refine(
    (value) => {
      try {
        const url = new URL(value);

        return (
          url.protocol === 'https:' &&
          (url.hostname === 'amazon.in' || url.hostname === 'www.amazon.in')
        );
      } catch {
        return false;
      }
    },
    {
      message: 'Amazon URL must be a valid Amazon.in HTTPS URL'
    }
  )
  .optional();

const amazonUrlUpdateSchema = z
  .string()
  .trim()
  .url()
  .max(2048)
  .refine(
    (value) => {
      try {
        const url = new URL(value);

        return (
          url.protocol === 'https:' &&
          (url.hostname === 'amazon.in' || url.hostname === 'www.amazon.in')
        );
      } catch {
        return false;
      }
    },
    {
      message: 'Amazon URL must be a valid Amazon.in HTTPS URL'
    }
  )
  .nullable()
  .optional();

const asinSchema = z
  .string()
  .trim()
  .regex(
    /^[A-Z0-9]{10}$/,
    'ASIN must contain exactly 10 uppercase letters or numbers'
  )
  .optional();

const asinUpdateSchema = z
  .string()
  .trim()
  .regex(
    /^[A-Z0-9]{10}$/,
    'ASIN must contain exactly 10 uppercase letters or numbers'
  )
  .nullable()
  .optional();

const priceSchema = z.coerce.number().finite().positive().max(MAX_PRICE);

const nullablePriceSchema = z.coerce
  .number()
  .finite()
  .positive()
  .max(MAX_PRICE)
  .nullable()
  .optional();

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200),

    slug: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      ),

    shortDescription: z.string().trim().min(1).max(500),

    description: z.string().trim().min(1).max(20_000),

    categoryId: cuidSchema,

    price: priceSchema,

    originalPrice: priceSchema.optional(),

    rating: z.coerce.number().finite().min(0).max(5).optional(),

    reviewCount: z.coerce.number().int().min(0).max(100_000_000).optional(),

    amazonUrl: amazonUrlSchema,

    asin: asinSchema,

    isFeatured: z.boolean().default(false),

    isTrending: z.boolean().default(false),

    isPublished: z.boolean().default(false)
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.originalPrice !== undefined && data.originalPrice < data.price) {
      ctx.addIssue({
        code: 'custom',
        path: ['originalPrice'],
        message: 'Original price must be greater than or equal to price'
      });
    }
  });

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),

    slug: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      )
      .optional(),

    shortDescription: z.string().trim().min(1).max(500).optional(),

    description: z.string().trim().min(1).max(20_000).optional(),

    categoryId: cuidSchema.optional(),

    price: priceSchema.optional(),

    originalPrice: nullablePriceSchema,

    rating: z.coerce.number().finite().min(0).max(5).nullable().optional(),

    reviewCount: z.coerce.number().int().min(0).max(100_000_000).optional(),

    amazonUrl: amazonUrlUpdateSchema,

    asin: asinUpdateSchema,

    isFeatured: z.boolean().optional(),

    isTrending: z.boolean().optional(),

    isPublished: z.boolean().optional()
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.originalPrice !== undefined &&
      data.originalPrice !== null &&
      data.price !== undefined &&
      data.originalPrice < data.price
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['originalPrice'],
        message: 'Original price must be greater than or equal to price'
      });
    }
  });

export const productIdSchema = cuidSchema;

export const productImageIdSchema = cuidSchema;

export const productQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100_000).default(1),

    pageSize: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().max(200).optional(),

    categoryId: cuidSchema.optional(),

    featured: z.enum(['true', 'false']).optional(),

    trending: z.enum(['true', 'false']).optional(),

    sort: z
      .enum(['newest', 'oldest', 'name', 'price', 'rating'])
      .default('newest'),

    direction: z.enum(['asc', 'desc']).default('desc')
  })
  .strict();
