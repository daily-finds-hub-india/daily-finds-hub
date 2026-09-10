'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  ShieldCheck,
  User
} from 'lucide-react';

import { BrandMark } from '@/components/layout/BrandMark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { IconButton } from '@/components/ui/IconButton';
import { LogoutButton } from './LogoutButton';
import { AdminMobileMenu } from './AdminMobileMenu';

interface AdminHeaderProps {
  username?: string;
  authenticated?: boolean;
}

export function AdminHeader({
  username = 'Admin',
  authenticated = true
}: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName = username || 'Admin';
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--header-background)] backdrop-blur-md">
        {/* Full Edge-to-Edge Container */}
        <div className="flex h-[4.5rem] sm:h-[4.75rem] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Side: Branding & Admin Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandMark />

            {authenticated ? (
              <span className="hidden items-center gap-1 rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)] sm:inline-flex">
                <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                Admin
              </span>
            ) : null}
          </div>

          {/* Right Side: Desktop Controls */}
          <div className="hidden items-center gap-2 lg:flex">
            {authenticated ? (
              <>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>View Site</span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                    aria-hidden="true"
                  />
                </Link>

                <ThemeToggle />

                <div
                  aria-hidden="true"
                  className="mx-1 h-4 w-px bg-[var(--border)]"
                />

                <div ref={userMenuRef} className="relative w-48">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className={`flex h-10 w-full items-center justify-between gap-2 border p-1 pr-3 transition-all duration-200 focus-visible:outline-none ${
                      userMenuOpen
                        ? 'rounded-t-lg border-[var(--accent)] bg-[var(--surface-muted)] text-[var(--text-primary)] border-b-transparent'
                        : 'rounded-lg border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-slate-950">
                        {userInitial}
                      </span>

                      <div className="min-w-0 text-left">
                        <span className="block truncate text-xs font-bold text-[var(--text-primary)]">
                          {displayName}
                        </span>
                        <span className="block truncate text-[9px] font-semibold text-[var(--text-muted)]">
                          Administrator
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={`shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180 text-[var(--accent)]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Connected Dropdown Container */}
                  {userMenuOpen ? (
                    <div
                      role="menu"
                      aria-label="Account menu"
                      className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-xl border border-t-0 border-[var(--accent)] bg-[var(--surface-muted)] p-1 shadow-2xl animate-in fade-in-0 slide-in-from-top-1 duration-150"
                    >
                      <div className="space-y-0.5">
                        <Link
                          href="/admin/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                        >
                          <User
                            size={14}
                            strokeWidth={1.8}
                            className="text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                          />
                          <span>Update Profile</span>
                        </Link>
                      </div>

                      <div className="my-1 border-t border-[var(--border)]" />

                      <div onClick={() => setUserMenuOpen(false)}>
                        <LogoutButton />
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <ThemeToggle />
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <IconButton
              label="Open admin menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </header>

      <AdminMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        username={username}
        authenticated={authenticated}
      />
    </>
  );
}
