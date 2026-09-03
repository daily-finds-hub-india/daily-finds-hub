'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Discover', href: '/' },
  { label: 'Categories', href: '/category' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-all duration-300',
          'border-[var(--border)]',
          'bg-[var(--header-background)] backdrop-blur-md',
          scrolled && 'shadow-[var(--shadow-subtle)]'
        )}
      >
        <Container className="flex h-18 items-center justify-between">
          <Link
            href="/"
            className="group shrink-0"
            aria-label="Daily Finds Hub home"
          >
            <span className="block text-base font-bold tracking-[-0.03em]">
              Daily Finds
            </span>

            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
              Hub India
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <HeaderSearch
              isOpen={searchOpen}
              onOpen={openSearch}
              onClose={closeSearch}
            />

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <div className="lg:hidden">
              <IconButton
                label="Open navigation menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={20} strokeWidth={1.8} />
              </IconButton>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
