import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataProvider } from '@/components/admin/AdminDataProvider';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { requireAdmin } from '@/lib/auth/require-admin';

export default async function ProtectedAdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <AdminDataProvider>
      <div className="admin-shell">
        <AdminHeader username={admin.username} />

        <div className="flex min-h-[calc(100vh-4rem)]">
          <AdminNavigation />
          <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
