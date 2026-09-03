import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';

const discoverLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/category' }
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Affiliate Disclosure', href: '/disclosure' }
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container>
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:py-20">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-block"
              aria-label="Daily Finds Hub home"
            >
              <span className="block text-base font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                Daily Finds
              </span>

              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
                Hub India
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
              Useful gadgets, clever products, and interesting finds worth
              discovering.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Discover
            </h2>

            <nav className="mt-5" aria-label="Discover">
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Company
            </h2>

            <nav className="mt-5" aria-label="Company">
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Legal
            </h2>

            <nav className="mt-5" aria-label="Legal">
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}

                      {link.href === '/disclosure' && (
                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.7}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-[var(--border)] py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Daily Finds Hub India. All rights
            reserved.
          </p>

          <p>Discover better. Every day.</p>
        </div>
      </Container>
    </footer>
  );
}
