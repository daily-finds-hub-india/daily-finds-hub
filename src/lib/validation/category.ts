import { z } from 'zod';

const categoryImagesSchema = z.array(
  z.object({
    url: z.string().trim().url('Image URL must be valid.'),
    publicId: z.string().trim().min(1, 'Image public ID is required.'),
    altText: z.string().trim().max(200, 'Alt text is too long.'),
    isPrimary: z.boolean()
  })
);

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required.')
    .max(80, 'Category name must be 80 characters or fewer.'),

  description: z
    .string()
    .trim()
    .max(300, 'Description must be 300 characters or fewer.')
    .default(''),

  image: z.string().trim().max(500, 'Image URL is too long.').default(''),
  imagePublicId: z
    .string()
    .trim()
    .max(300, 'Image public ID is too long.')
    .nullable()
    .optional()
    .default(null),
  isFeatured: z.boolean().default(false),
  images: categoryImagesSchema.default([])
});

export const categoryUpdateSchema = categoryCreateSchema;

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
