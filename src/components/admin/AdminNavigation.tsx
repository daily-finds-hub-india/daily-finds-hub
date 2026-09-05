'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tags, X } from 'lucide-react';

const navigation = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags }
];

interface AdminNavigationProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminNavigation({
  mobileOpen = false,
  onClose
}: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`admin-surface fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--border)] p-5 transition-transform duration-200 lg:static lg:z-auto lg:flex lg:w-64 lg:translate-x-0 lg:flex-col lg:shrink-0 lg:border-r ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-1 space-y-1 lg:mt-0" aria-label="Admin navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/admin' ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-[var(--accent)] text-slate-950 shadow-xs font-bold scale-[1.01]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
