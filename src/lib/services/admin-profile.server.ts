// src/lib/services/admin-profile.server.ts
import { requireAdmin } from '@/lib/auth/require-admin';
import { prisma } from '@/lib/prisma';
import { AdminUser } from '@/types/admin';

export async function getAdminProfileData(): Promise<{
  admin: AdminUser;
  pendingCleanupCount: number;
}> {
  const adminRecord = await requireAdmin();

  const admin = await prisma.adminUser.findUnique({
    where: { id: adminRecord.id },
    select: {
      id: true,
      username: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  const pendingCleanupCount = await prisma.cloudinaryCleanup.count();

  return {
    admin: {
      id: admin.id,
      username: admin.username,
      isActive: admin.isActive,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString()
    },
    pendingCleanupCount
  };
}
