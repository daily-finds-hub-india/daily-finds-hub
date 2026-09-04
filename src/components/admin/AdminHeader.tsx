'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';

import { AdminNavigation } from './AdminNavigation';
import { LogoutButton } from './LogoutButton';

interface AdminHeaderProps {
  username: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setNavigationOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Admin workspace
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Daily Finds Hub
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-[var(--text-secondary)] sm:block">
              {username}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="lg:hidden">
        <AdminNavigation
          mobileOpen={navigationOpen}
          onClose={() => setNavigationOpen(false)}
        />
      </div>
    </>
  );
}
