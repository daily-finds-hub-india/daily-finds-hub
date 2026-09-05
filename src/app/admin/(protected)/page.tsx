import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Package, Radio, Plus, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AdminPage() {
  const [productCount, categoryCount, publishedCount, featuredCount, trendingCount] = await Promise.all([
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
    })
  ]);

  const draftCount = Math.max(0, productCount - publishedCount);
  const publishedRatio = productCount > 0 ? Math.round((publishedCount / productCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            <Sparkles size={13} strokeWidth={2} />
            <span>Store Performance</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Admin Cockpit
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Catalog metrics, publishing health, and inventory status for Daily Finds Hub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Products',
            value: productCount,
            subtitle: `${draftCount} pending draft${draftCount === 1 ? '' : 's'}`,
            icon: Package,
            href: '/admin/products',
            badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          },
          {
            label: 'Live Published',
            value: publishedCount,
            subtitle: `${publishedRatio}% of full catalog`,
            icon: Radio,
            href: '/admin/products',
            badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          },
          {
            label: 'Categories',
            value: categoryCount,
            subtitle: 'Curated taxonomies',
            icon: FolderKanban,
            href: '/admin/categories',
            badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
          },
          {
            label: 'Social Spotlight',
            value: featuredCount + trendingCount,
            subtitle: `${featuredCount} featured • ${trendingCount} trending`,
            icon: Sparkles,
            href: '/admin/products',
            badgeBg: 'bg-[var(--accent-soft)] text-[var(--accent)]'
          }
        ].map(({ label, value, subtitle, icon: Icon, href, badgeBg }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${badgeBg}`}>
                <Icon size={18} strokeWidth={2} />
              </div>
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {value}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
              <span className="text-[var(--text-muted)]">{subtitle}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] group-hover:underline">
                View <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Catalog Health & Workflow Section */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Workflow Guidance Card */}
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <Sparkles size={14} />
            <span>Editorial Workflow</span>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Streamlined Social to Affiliate Pipeline
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Keep your visitor experience flawless. Whenever you post a new Instagram Reel or YouTube Short, publish the product with its direct Amazon.in affiliate link and tag it as <strong>Trending</strong> or <strong>Featured</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Package size={15} />
              Manage Products
            </Link>

            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <FolderKanban size={15} />
              Manage Categories
            </Link>
          </div>
        </section>

        {/* Catalog Health Gauge */}
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)]/60 p-7 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Catalog Visibility
              </span>
              <span className="rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-0.5 text-xs font-bold text-[var(--text-primary)]">
                {publishedRatio}% Active
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${publishedRatio}%` }}
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
              {productCount === 0
                ? 'Your catalog is currently empty. Add your first category and product to launch.'
                : `${publishedCount} out of ${productCount} products are published and immediately discoverable by visitors.`}
            </p>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-4 flex items-center gap-3">
            {draftCount > 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle size={15} />
                <span>{draftCount} product{draftCount === 1 ? '' : 's'} waiting in draft</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} />
                <span>All products in the catalog are published!</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
