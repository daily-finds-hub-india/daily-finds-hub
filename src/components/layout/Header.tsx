'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { BrandMark } from '@/components/layout/BrandMark';
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
        <Container className="flex h-[4.75rem] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <BrandMark />
            <span className="hidden border-l border-[var(--border)] pl-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] xl:block">
              Useful things, considered
            </span>
          </div>

          <nav
            className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xs md:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <HeaderSearch
              isOpen={searchOpen}
              onOpen={openSearch}
              onClose={closeSearch}
            />

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <div className="md:hidden">
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
