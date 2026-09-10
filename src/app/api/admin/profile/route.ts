// src/app/api/admin/profile/route.ts
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api/response';
import { serverError } from '@/lib/api/server-error';
import { methodNotAllowed, isMethodAllowed } from '@/lib/api/method';
import { parseJson } from '@/lib/api/parse-json';
import { validate } from '@/lib/api/validate';
import { updateAdminSchema } from '@/lib/validation/adminProfile';
import bcryptjs from 'bcryptjs';

const ALLOWED_METHODS = ['PATCH'] as const;

export async function PATCH(request: Request) {
  if (!isMethodAllowed(request, ALLOWED_METHODS)) {
    return methodNotAllowed([...ALLOWED_METHODS]);
  }

  try {
    const adminCheck = await requireApiAdmin(request);
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const jsonResult = await parseJson(request);
    if (!jsonResult.success) {
      return jsonResult.response;
    }

    const validation = validate(updateAdminSchema, jsonResult.data);
    if (!validation.success) {
      return validation.response;
    }

    const { username, currentPassword, newPassword } = validation.data;

    const currentAdmin = await prisma.adminUser.findUnique({
      where: { id: adminCheck.admin.id }
    });

    if (!currentAdmin) {
      return apiError('Admin not found', 404);
    }

    const updateData: {
      username?: string;
      passwordHash?: string;
      sessionVersion?: { increment: number };
    } = {};

    if (username && username !== currentAdmin.username) {
      const existing = await prisma.adminUser.findUnique({
        where: { username }
      });

      if (existing) {
        return apiError('Username is already taken', 400);
      }

      updateData.username = username;
    }

    if (newPassword) {
      if (!currentPassword) {
        return apiError('Current password is required', 400);
      }

      const passwordValid = await bcryptjs.compare(
        currentPassword,
        currentAdmin.passwordHash
      );
      if (!passwordValid) {
        return apiError('Incorrect current password', 400);
      }

      updateData.passwordHash = await bcryptjs.hash(newPassword, 12);
      updateData.sessionVersion = { increment: 1 };
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id: adminCheck.admin.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        isActive: true,
        updatedAt: true
      }
    });

    return apiSuccess({
      message: 'Admin profile updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    return serverError(error);
  }
}
