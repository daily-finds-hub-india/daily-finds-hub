'use client';

import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';

interface AdminShellProps {
  children: ReactNode;
  username: string;
}

export function AdminShell({ children, username }: AdminShellProps) {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <AdminHeader username={username} authenticated />

        <div className="flex min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-4.75rem)]">
          <div className="hidden shrink-0 lg:block">
            <AdminNavigation />
          </div>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
