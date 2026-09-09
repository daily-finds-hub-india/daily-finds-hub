import Link from 'next/link';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Package,
  Plus,
  Radio,
  Sparkles,
  Edit
} from 'lucide-react';

import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  const [
    productCount,
    categoryCount,
    publishedCount,
    featuredCount,
    trendingCount,
    recentProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({
      where: { isPublished: true }
    }),
    prisma.product.count({
      where: { isFeatured: true }
    }),
    prisma.product.count({
      where: { isTrending: true }
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { name: true }
        },
        images: {
          take: 1,
          where: { isPrimary: true },
          select: { url: true, altText: true }
        }
      }
    })
  ]);

  const draftCount = Math.max(0, productCount - publishedCount);
  const publishedRatio =
    productCount > 0 ? Math.round((publishedCount / productCount) * 100) : 0;
  const spotlightCount = featuredCount + trendingCount;

  return (
    <div className="w-full space-y-7 sm:space-y-8">
      {/* =========================================================
          PAGE HEADER
         ========================================================= */}
      <section className="border-b border-[var(--border)] pb-6 sm:pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:px-3 sm:text-xs sm:tracking-wider">
              <Sparkles size={13} strokeWidth={2} aria-hidden="true" />
              <span>Store Performance</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Manage your catalog, monitor publishing status, and keep your
              product discovery pipeline organized.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/admin/products"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:w-auto"
            >
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRIMARY METRICS
         ========================================================= */}
      <section aria-label="Catalog metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Products"
            value={productCount}
            subtitle={`${draftCount} pending draft${
              draftCount === 1 ? '' : 's'
            }`}
            icon={Package}
            href="/admin/products"
            iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />

          <MetricCard
            label="Live Published"
            value={publishedCount}
            subtitle={`${publishedRatio}% of full catalog`}
            icon={Radio}
            href="/admin/products"
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />

          <MetricCard
            label="Categories"
            value={categoryCount}
            subtitle="Curated taxonomies"
            icon={FolderKanban}
            href="/admin/categories"
            iconClassName="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />

          <MetricCard
            label="Social Spotlight"
            value={spotlightCount}
            subtitle={`${featuredCount} featured • ${trendingCount} trending`}
            icon={Sparkles}
            href="/admin/products"
            iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]"
          />
        </div>
      </section>

      {/* =========================================================
          WORKFLOW + CATALOG HEALTH
         ========================================================= */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.9fr)]">
        {/* Editorial Workflow */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs sm:p-6 lg:p-7">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs sm:tracking-wider">
            <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            <span>Editorial Workflow</span>
          </div>

          <h2 className="mt-3 max-w-2xl text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Social content to affiliate product pipeline
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            When you publish a new Instagram Reel or YouTube Short, add the
            product here, attach its Amazon.in affiliate link, and use the
            Featured or Trending status to control how it appears across the
            store.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              href="/admin/products"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:w-auto"
            >
              <Package size={15} strokeWidth={1.9} aria-hidden="true" />
              <span>Manage Products</span>
            </Link>

            <Link
              href="/admin/categories"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:w-auto"
            >
              <FolderKanban size={15} strokeWidth={1.9} aria-hidden="true" />
              <span>Manage Categories</span>
            </Link>
          </div>
        </section>

        {/* Catalog Visibility */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/60 p-5 shadow-xs sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] sm:text-xs sm:tracking-wider">
                Catalog Visibility
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                Publishing health
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-primary)] sm:text-xs">
              {publishedRatio}% active
            </span>
          </div>

          <div
            className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--border)]"
            role="progressbar"
            aria-valuenow={publishedRatio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Published catalog percentage"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{
                width: `${publishedRatio}%`
              }}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
            {productCount === 0
              ? 'Your catalog is currently empty. Add your first category and product to get started.'
              : `${publishedCount} of ${productCount} products are published and discoverable by visitors.`}
          </p>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            {draftCount > 0 ? (
              <div className="flex items-start gap-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {draftCount} product
                  {draftCount === 1 ? '' : 's'} waiting in draft
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>All products in the catalog are published.</span>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* =========================================================
          RECENTLY ADDED PRODUCTS
         ========================================================= */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs sm:p-6 lg:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Recently Added Products
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Latest items added to your catalog
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="py-8 text-center text-sm text-[var(--text-muted)]">
            No products found. Click &quot;Add Product&quot; to create your
            first item.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-[var(--surface-muted)]/50"
                  >
                    <td className="py-3 pl-2 font-medium text-[var(--text-primary)]">
                      <div className="flex items-center gap-3">
                        {p.images[0]?.url ? (
                          <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-[var(--border)]">
                            <Image
                              src={p.images[0].url}
                              alt={p.images[0].altText || p.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)]">
                            <Package size={16} />
                          </div>
                        )}
                        <span className="truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {p.category.name}
                    </td>
                    <td className="py-3 font-semibold text-[var(--text-primary)]">
                      ₹{p.price.toString()}
                    </td>
                    <td className="py-3">
                      {p.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <Link
                        href={`/admin/products?edit=${p.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] p-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Edit size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* =============================================================
    METRIC CARD
   ============================================================= */

interface MetricCardProps {
  label: string;
  value: number;
  subtitle: string;
  icon: typeof Package;
  href: string;
  iconClassName: string;
}

function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  href,
  iconClassName
}: MetricCardProps) {
  return (
    <Link
      href={href}
      className="group min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] sm:text-xs sm:tracking-wider">
          {label}
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        {value}
      </p>

      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
        <span className="min-w-0 truncate text-xs text-[var(--text-muted)]">
          {subtitle}
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--accent)]">
          <span className="hidden sm:inline">View</span>

          <ArrowRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
