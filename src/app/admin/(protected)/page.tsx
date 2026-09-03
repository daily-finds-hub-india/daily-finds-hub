export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Overview
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Manage your Daily Finds Hub content from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Products</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
            0
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Categories</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
            0
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-muted)]">Published</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
            0
          </p>
        </div>
      </div>

      <div className="mt-8 border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Getting started
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Start by creating your product categories. Once categories are
          available, you can add products and publish them to the website.
        </p>
      </div>
    </div>
  );
}
