export default function AdminProductsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Management
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Products
        </h1>

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Add, edit, publish, and manage your products.
        </p>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="text-sm text-[var(--text-secondary)]">
          Product management will be available here.
        </p>
      </div>
    </div>
  );
}
