import { z } from 'zod';

const amazonUrlSchema = z
  .string()
  .trim()
  .max(1000, 'Amazon URL is too long.')
  .refine(
    (value) => {
      if (!value) return true;

      try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();

        return (
          url.protocol === 'https:' &&
          !url.username &&
          !url.password &&
          (hostname === 'amazon.in' || hostname.endsWith('.amazon.in')) &&
          url.pathname.length > 1
        );
      } catch {
        return false;
      }
    },
    {
      message: 'Enter a valid Amazon.in HTTPS URL.'
    }
  );

const asinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{10}$/, 'ASIN must contain exactly 10 letters/numbers.');

const productImagesSchema = z.array(
  z.object({
    url: z.string().trim().url('Image URL must be valid.'),
    publicId: z.string().trim().min(1, 'Image public ID is required.'),
    altText: z.string().trim().max(200, 'Alt text is too long.'),
    isPrimary: z.boolean()
  })
);

export const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required.')
    .max(150, 'Product name must be 150 characters or fewer.'),

  shortDescription: z
    .string()
    .trim()
    .min(1, 'Short description is required.')
    .max(300, 'Short description must be 300 characters or fewer.'),

  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(5000, 'Description must be 5000 characters or fewer.'),

  categoryId: z.string().trim().min(1, 'Category is required.'),

  price: z.coerce
    .number()
    .finite('Price must be a valid number.')
    .min(0, 'Price cannot be negative.')
    .max(99999999.99, 'Price is too large.'),

  originalPrice: z
    .union([
      z.literal(''),
      z.coerce
        .number()
        .finite('Original price must be a valid number.')
        .min(0, 'Original price cannot be negative.')
        .max(99999999.99, 'Original price is too large.')
    ])
    .transform((value) => (value === '' ? null : value)),

  rating: z.coerce
    .number()
    .finite('Rating must be a valid number.')
    .min(0, 'Rating cannot be below 0.')
    .max(5, 'Rating cannot be above 5.'),

  reviewCount: z.coerce
    .number()
    .int('Review count must be a whole number.')
    .min(0, 'Review count cannot be negative.')
    .max(999999999, 'Review count is too large.'),

  amazonUrl: amazonUrlSchema,

  asin: z
    .union([asinSchema, z.literal('')])
    .transform((value) => (value === '' ? null : value)),

  isFeatured: z.boolean().default(false),

  isTrending: z.boolean().default(false),

  isPublished: z.boolean().default(false),

  images: productImagesSchema.default([])
});

export const productUpdateSchema = productCreateSchema;

export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
