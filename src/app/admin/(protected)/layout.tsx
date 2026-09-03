import { LogoutButton } from '@/components/admin/LogoutButton';
import { requireAdmin } from '@/lib/auth/require-admin';

export default async function ProtectedAdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Daily Finds Hub
            </p>

            <p className="text-xs text-[var(--text-muted)]">Admin Panel</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--text-secondary)] sm:block">
              {admin.username}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] md:block">
          <nav className="p-4">
            <div className="space-y-1">
              <a
                href="/admin"
                className="block px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                Dashboard
              </a>

              <a
                href="/admin/products"
                className="block px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                Products
              </a>

              <a
                href="/admin/categories"
                className="block px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--background)] hover:text-[var(--accent)]"
              >
                Categories
              </a>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
