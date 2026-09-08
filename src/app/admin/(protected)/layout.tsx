import type { ReactNode } from 'react';

import { requireAdmin } from '@/lib/auth/require-admin';
import { AdminShell } from '@/components/admin/AdminShell';

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

export default async function ProtectedAdminLayout({
  children
}: ProtectedAdminLayoutProps) {
  const admin = await requireAdmin();

  return <AdminShell username={admin.username}>{children}</AdminShell>;
}
