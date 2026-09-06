'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import { Container } from '@/components/layout/Container';
import { BrandMark } from '@/components/layout/BrandMark';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';
import { navigation } from '@/components/layout/navigation';

export function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function isActiveRoute(href: string) {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  function openMenu() {
    setSearchOpen(false);
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-[box-shadow,background-color,border-color] duration-300',
          'border-[var(--border)]',
          'bg-[var(--header-background)] backdrop-blur-md',
          scrolled && 'shadow-[var(--shadow-subtle)]'
        )}
      >
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-3 sm:min-h-[4.75rem] sm:gap-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <BrandMark />

            <span className="hidden border-l border-[var(--border)] pl-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] xl:block">
              Useful things, considered
            </span>
          </div>

          <nav
            className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xs md:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => {
              const active = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 lg:px-4',
                    active
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white'
                  )}
                >
                  {/* Sliding Background Indicator */}
                  {active && (
                    <motion.div
                      layoutId="active-nav-pill"
                      layout="x"
                      className={cn(
                        'absolute inset-0 rounded-full border shadow-sm',
                        'border-[var(--accent)]',
                        'bg-[var(--accent-soft)]'
                      )}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <HeaderSearch
              isOpen={searchOpen}
              onOpen={openSearch}
              onClose={closeSearch}
            />

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <div className="md:hidden">
              <IconButton label="Open navigation menu" onClick={openMenu}>
                <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
              </IconButton>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
