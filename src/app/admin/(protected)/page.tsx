import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Package, Radio } from 'lucide-react';

export default async function AdminPage() {
  const [productCount, categoryCount, publishedCount] = await Promise.all([
    prisma.product.count(),

    prisma.category.count(),

    prisma.product.count({
      where: {
        isPublished: true
      }
    })
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            A quick view of your catalog and publishing pipeline.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Manage products <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Total products',
            value: productCount,
            icon: Package,
            href: '/admin/products'
          },
          {
            label: 'Categories',
            value: categoryCount,
            icon: FolderKanban,
            href: '/admin/categories'
          },
          {
            label: 'Published products',
            value: publishedCount,
            icon: Radio,
            href: '/admin/products'
          }
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
              <Icon size={18} className="text-[var(--accent)]" />
            </div>
            <p className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
              {value}
            </p>
            <p className="mt-3 text-xs text-[var(--text-muted)] group-hover:text-[var(--accent)]">
              Open {label.toLowerCase()}{' '}
              <ArrowRight className="ml-1 inline" size={13} />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Publishing workflow
          </p>
          <h2 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            Build a catalog people can discover.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            Create categories, add products with images and affiliate links,
            then publish only the finds ready for visitors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/categories"
              className="border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)]"
            >
              Manage categories
            </Link>
            <Link
              href="/admin/products"
              className="border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)]"
            >
              Manage products
            </Link>
          </div>
        </section>
        <section className="border border-[var(--border)] bg-[var(--surface-muted)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Catalog health
          </p>
          <p className="mt-5 text-sm leading-6 text-[var(--text-secondary)]">
            {productCount === 0
              ? 'Your catalog is empty. Start with a category, then create your first product.'
              : `${publishedCount} of ${productCount} products are currently visible to visitors.`}
          </p>
        </section>
      </div>
    </div>
  );
}
