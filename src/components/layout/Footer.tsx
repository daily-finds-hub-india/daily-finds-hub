import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { BrandMark } from '@/components/layout/BrandMark';

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
    <footer className="site-footer border-t border-[var(--border)]">
      <Container>
        <div className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-sm">
            <BrandMark />

            <p className="mt-6 max-w-xs text-sm leading-6 text-[color-mix(in_srgb,var(--background)_68%,transparent)]">
              A considered collection of useful products, with context before
              the next click.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--signal)]">
              Discover
            </h2>

            <nav className="mt-5" aria-label="Discover">
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color-mix(in_srgb,var(--background)_72%,transparent)] transition-colors hover:text-[var(--signal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--signal)]">
              Company
            </h2>

            <nav className="mt-5" aria-label="Company">
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color-mix(in_srgb,var(--background)_72%,transparent)] transition-colors hover:text-[var(--signal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--signal)]">
              Legal
            </h2>

            <nav className="mt-5" aria-label="Legal">
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color-mix(in_srgb,var(--background)_72%,transparent)] transition-colors hover:text-[var(--signal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--background)_20%,transparent)] py-6 text-xs text-[color-mix(in_srgb,var(--background)_55%,transparent)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Daily Finds Hub India. All rights
            reserved.
          </p>

          <p>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </Container>
    </footer>
  );
}
