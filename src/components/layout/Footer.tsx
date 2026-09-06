import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';

const discoverLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' }
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
    <footer className="site-footer border-t border-slate-800 bg-slate-950 text-slate-300">
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
            <div className="max-w-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Daily Finds Hub
              </p>

              <h2 className="mt-4 max-w-sm text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl">
                Useful things,
                <br />
                considered carefully.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
                A curated collection of useful products, clever gadgets, and
                interesting everyday finds — with context before the next click.
              </p>
            </div>

            <FooterLinkGroup title="Discover" links={discoverLinks} />

            <FooterLinkGroup title="Company" links={companyLinks} />

            <FooterLinkGroup title="Legal" links={legalLinks} />
          </div>

          <div className="mt-12 border-t border-slate-800 pt-6 sm:mt-16">
            <div className="flex flex-col gap-3 text-xs leading-5 text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <p className="max-w-2xl">
                As an Amazon Associate I earn from qualifying purchases.
              </p>

              <p className="shrink-0">
                © {new Date().getFullYear()} Daily Finds Hub. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

interface FooterLinkGroupProps {
  title: string;
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
        {title}
      </h2>

      <nav className="mt-5" aria-label={`${title} links`}>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex min-h-8 items-center gap-1 text-sm text-slate-300 transition-colors hover:text-white"
              >
                <span>{link.label}</span>

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.7}
                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
