'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';

import { IconButton } from '@/components/ui/IconButton';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { label: 'Discover', href: '/' },
  { label: 'Categories', href: '/category' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' }
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--background)] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex h-20 items-center justify-between border-b border-[var(--border)] px-5 sm:px-8">
        <Link
          href="/"
          onClick={onClose}
          className="group"
          aria-label="Daily Finds Hub home"
        >
          <span className="block text-base font-bold leading-none tracking-[-0.03em] text-[var(--text-primary)]">
            Daily Finds
          </span>

          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
            Hub India
          </span>
        </Link>

        <IconButton label="Close navigation menu" onClick={onClose}>
          <X size={21} strokeWidth={1.8} />
        </IconButton>
      </div>

      <nav className="px-5 pt-7 sm:px-8 sm:pt-9" aria-label="Mobile navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="group flex min-h-14 items-center justify-between border-b border-[var(--border)] py-3 text-[1.35rem] font-medium leading-tight tracking-[-0.025em] text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--accent)]"
              >
                <span>{item.label}</span>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.7}
                  className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-center justify-between py-5">
          <div>
            <p className="text-base font-medium tracking-tight text-[var(--text-primary)]">
              Appearance
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Switch between light and dark
            </p>
          </div>

          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
