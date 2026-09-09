'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Tags
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAdminSidebar } from './AdminSidebarContext';

const adminNavigation = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Tags
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package
  }
];

export function AdminNavigation() {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useAdminSidebar();

  function isActiveRoute(href: string) {
    if (href === '/admin') {
      return pathname === '/admin';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      aria-label="Admin navigation"
      className={cn(
        'sticky top-[4.5rem] h-[calc(100vh-4.5rem)]',
        'shrink-0 overflow-hidden',
        'border-r border-[var(--border)]',
        'bg-[var(--surface)]',
        'transition-[width] duration-300 ease-out',
        'sm:top-[4.75rem] sm:h-[calc(100vh-4.75rem)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto py-6',
            collapsed ? 'px-2' : 'px-3'
          )}
          aria-label="Administration"
        >
          {!collapsed && (
            <p className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Administration
            </p>
          )}

          <ul className="space-y-1">
            {adminNavigation.map((item) => {
              const active = isActiveRoute(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex min-h-11 items-center rounded-xl',
                      'font-semibold',
                      'transition-colors duration-200',
                      collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                      active
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]"
                      />
                    )}

                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        'transition-colors duration-200',
                        active
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'
                      )}
                    >
                      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    {!collapsed && (
                      <span className="truncate text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Controls */}
        <div
          className={cn(
            'shrink-0 border-t border-[var(--border)]',
            collapsed ? 'p-2' : 'p-3'
          )}
        >
          {!collapsed && (
            <div className="mb-3 rounded-xl bg-[var(--surface-muted)] px-3 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Workspace
              </p>

              <p className="mt-1 text-xs font-semibold text-[var(--text-secondary)]">
                Manage your catalog
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex h-10 w-full items-center rounded-xl',
              'text-[var(--text-muted)]',
              'transition-colors duration-200',
              'hover:bg-[var(--surface-muted)]',
              'hover:text-[var(--text-primary)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--accent)]',
              collapsed ? 'justify-center' : 'justify-between px-3'
            )}
          >
            {!collapsed && (
              <span className="text-xs font-semibold">Collapse sidebar</span>
            )}

            {collapsed ? (
              <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <ChevronLeft size={17} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
