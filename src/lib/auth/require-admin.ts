import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      username: true,
      isActive: true,
      sessionVersion: true
    }
  });

  if (
    !admin ||
    !admin.isActive ||
    session.user.sessionVersion !== admin.sessionVersion
  ) {
    redirect('/admin/login');
  }

  return admin;
}
