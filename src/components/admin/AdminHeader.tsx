'use client';

import Link from 'next/link';
import { ArrowUpRight, Menu } from 'lucide-react';
import { useState } from 'react';

import { BrandMark } from '@/components/layout/BrandMark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AdminNavigation } from './AdminNavigation';
import { LogoutButton } from './LogoutButton';

interface AdminHeaderProps {
  username: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <>
      <header className="admin-surface sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavigationOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <BrandMark compact />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
            >
              <span>View Store</span>
              <ArrowUpRight size={13} strokeWidth={2} />
            </Link>

            <ThemeToggle />

            <div className="hidden h-4 w-px bg-[var(--border)] sm:block" />

            <span className="hidden text-xs font-semibold text-[var(--text-secondary)] sm:block">
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
