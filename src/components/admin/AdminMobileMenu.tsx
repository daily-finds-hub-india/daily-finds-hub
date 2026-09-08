'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, User, X } from 'lucide-react';

import { BrandMark } from '@/components/layout/BrandMark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';
import { LogoutButton } from './LogoutButton';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  authenticated?: boolean;
}

const adminNavigation = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' }
];

export function AdminMobileMenu({
  isOpen,
  onClose,
  username = 'Admin',
  authenticated = true
}: AdminMobileMenuProps) {
  const pathname = usePathname();
  const displayName = username || 'Admin';
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function isActiveRoute(href: string) {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-[var(--background)] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Admin menu"
    >
      {/* Mobile Top Header (No wrapper link around BrandMark) */}
      <div className="flex min-h-[4.5rem] shrink-0 items-center justify-between border-b border-[var(--border)] px-4 sm:min-h-[4.75rem] sm:px-8">
        <BrandMark />

        <IconButton label="Close navigation menu" onClick={onClose}>
          <X size={21} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
      </div>

      {/* Menu Body */}
      <div className="themed-scrollbar flex-1 overflow-y-auto">
        <nav
          className="flex h-full flex-col justify-between px-4 pb-8 pt-6 sm:px-8 sm:pt-8"
          aria-label="Admin mobile navigation"
        >
          <div className="space-y-8">
            {/* Admin Links */}
            <ul className="space-y-1">
              {adminNavigation.map((item) => {
                const active = isActiveRoute(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group flex min-h-14 items-center justify-between rounded-xl px-3.5 py-3 text-base font-semibold leading-tight transition-all duration-200',
                        active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--surface)] hover:text-[var(--accent)]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {active && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.label}</span>
                      </div>

                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.7}
                        className={cn(
                          'transition-all duration-200',
                          active
                            ? 'translate-x-0.5 -translate-y-0.5 text-[var(--accent)]'
                            : 'text-[var(--text-muted)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]'
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Appearance Card */}
            <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  Appearance
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                  Switch between light and dark
                </p>
              </div>

              <div className="shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* User Section & Logout Action */}
          {authenticated ? (
            <div className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-slate-950">
                  {userInitial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                    {displayName}
                  </p>
                  <p className="truncate text-[10px] text-[var(--text-muted)]">
                    Administrator
                  </p>
                </div>
              </div>

              <Link
                href="/admin/profile"
                onClick={onClose}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)]"
              >
                <User
                  size={18}
                  strokeWidth={1.8}
                  className="text-[var(--text-muted)]"
                />
                <span>Update Profile</span>
              </Link>

              <div className="w-full" onClick={onClose}>
                <LogoutButton />
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
