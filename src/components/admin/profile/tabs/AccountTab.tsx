import { useState } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { AdminUser } from '@/types/admin';
import { updateAdminProfileClient } from '@/lib/services/admin-profile.client';
import { SettingsFooter } from '../SettingsFooter';

export function AccountTab({ admin }: { admin: AdminUser }) {
  const [username, setUsername] = useState(admin.username);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const updatedUsername = username.trim();
    if (updatedUsername === admin.username) {
      setError('No changes made.');
      return;
    }

    setIsLoading(true);

    try {
      await updateAdminProfileClient({ username: updatedUsername });
      setSuccess('Profile updated successfully.');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  <User size={17} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                    Account information
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    Update the username associated with your administrator
                    account.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-8">
              <div className="max-w-xl">
                <label
                  htmlFor="username"
                  className="mb-2.5 block text-xs font-bold text-[var(--text-secondary)]"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/20 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-4 focus:ring-[var(--accent)]/10"
                    placeholder="Enter username"
                    minLength={3}
                    maxLength={50}
                    required
                  />
                </div>
                <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                  Username must contain between 3 and 50 characters.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/15 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Administrator access
              </h3>
              <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
                This account has full access to the administration panel and its
                management tools.
              </p>

              <div className="mt-6 space-y-4 border-t border-[var(--border)] pt-5">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)]">
                    Access level
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <ShieldCheck size={14} /> Administrator
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)]">
                    Account status
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />{' '}
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SettingsFooter
          isLoading={isLoading}
          error={error}
          success={success}
          disabled={false}
        />
      </div>
    </form>
  );
}
