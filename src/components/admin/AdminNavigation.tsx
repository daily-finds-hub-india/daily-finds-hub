'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Tags,
  CircleUserRound
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAdminSidebar } from './AdminSidebarContext';
import { LogoutButton } from './LogoutButton';

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

  const isProfileActive = isActiveRoute('/admin/profile');

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
        {/* Main Navigation Links */}
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
                      'group relative flex min-h-11 items-center rounded-xl overflow-hidden',
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
                        'flex shrink-0 items-center justify-center',
                        'transition-colors duration-200',
                        active
                          ? 'text-[var(--accent)]'
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

        {/* Bottom Footer Section */}
        <div
          className={cn(
            'flex flex-col gap-1 shrink-0 border-t border-[var(--border)]',
            collapsed ? 'p-2' : 'p-3'
          )}
        >
          {/* Profile Settings Link */}
          <Link
            href="/admin/profile"
            aria-current={isProfileActive ? 'page' : undefined}
            title={collapsed ? 'Profile Settings' : undefined}
            className={cn(
              'group relative flex min-h-11 items-center rounded-xl overflow-hidden',
              'font-semibold',
              'transition-colors duration-200',
              collapsed ? 'justify-center px-2' : 'gap-3 px-3',
              isProfileActive
                ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {isProfileActive && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]"
              />
            )}

            <span
              className={cn(
                'flex shrink-0 items-center justify-center',
                'transition-colors duration-200',
                isProfileActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'
              )}
            >
              <CircleUserRound size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>

            {!collapsed && (
              <span className="truncate text-sm">Profile Settings</span>
            )}
          </Link>

          {/* Functional Logout Button */}
          <LogoutButton collapsed={collapsed} />

          {/* Divider */}
          <div className="my-1.5 h-px w-full bg-[var(--border)]" />

          {/* Collapse Sidebar Toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex min-h-10 w-full items-center rounded-xl overflow-hidden',
              'text-[var(--text-muted)] font-semibold',
              'transition-colors duration-200',
              'hover:bg-[var(--surface-muted)]',
              'hover:text-[var(--text-primary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              collapsed ? 'justify-center' : 'justify-between px-3'
            )}
          >
            {!collapsed && <span className="text-xs">Collapse sidebar</span>}
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
