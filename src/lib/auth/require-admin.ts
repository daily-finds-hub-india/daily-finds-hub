import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      id: session.user.id
    }
  });

  if (!admin || !admin.isActive) {
    redirect('/admin/login');
  }

  return admin;
}
