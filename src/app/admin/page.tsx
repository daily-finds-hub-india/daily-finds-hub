import { requireAdmin } from '@/lib/auth/require-admin';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Daily Finds Hub
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-[var(--text-secondary)]">
          Authentication protection is working.
        </p>

        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Signed in as {admin.username}.
        </p>

        <LogoutButton />
      </div>
    </main>
  );
}
