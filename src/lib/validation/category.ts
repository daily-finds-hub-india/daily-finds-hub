import { z } from 'zod';

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

  isFeatured: z.boolean().default(false)
});

export const categoryUpdateSchema = categoryCreateSchema;

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
