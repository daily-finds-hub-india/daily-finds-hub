import { z } from 'zod';

export const updateAdminSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50)
      .optional(),
    currentPassword: z
      .string()
      .min(1, 'Current password is required to make changes')
      .optional(),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .optional()
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword']
    }
  );

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
