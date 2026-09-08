import { type FormEvent, type ReactNode } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Eye,
  Tag,
  Link as LinkIcon,
  AlertCircle,
  IndianRupee,
  Star,
  MessageSquare,
  Check,
  Edit3,
  Plus,
  Type,
  AlignLeft,
  Percent
} from 'lucide-react';
import { Product, ProductFormData } from '@/types/product';
import { categories } from '@/lib/constants/productConstants';

interface ProductDialogProps {
  editingProduct: Product | null;
  form: ProductFormData;
  formError: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => void;
}

export function ProductDialog({
  editingProduct,
  form,
  formError,
  onClose,
  onSubmit,
  onChange
}: ProductDialogProps) {
  const isEditing = Boolean(editingProduct);

  // Compute live discount percentage for feedback
  const priceNum = Number(form.price);
  const originalPriceNum = Number(form.originalPrice);
  const discountPercent =
    originalPriceNum && priceNum && originalPriceNum > priceNum
      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
      : null;

  function handleNameChange(value: string) {
    onChange('name', value);
    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      onChange('slug', generatedSlug);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-md transition-opacity animate-in fade-in sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-h-[88dvh] sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] via-amber-400 to-orange-500" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-xs">
              {isEditing ? (
                <Edit3 size={20} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Plus size={22} strokeWidth={2.2} aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="product-dialog-title"
                  className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl"
                >
                  {isEditing ? 'Edit Product' : 'Create New Product'}
                </h2>
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {isEditing ? 'Update' : 'New Item'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {isEditing
                  ? 'Update pricing, publication status, and affiliate metadata.'
                  : 'Add a new affiliate item to your active catalog.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={onSubmit}
          className="themed-scrollbar min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-6 sm:p-8">
            {/* Error Message */}
            {formError ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold leading-relaxed text-red-600 dark:text-red-400"
              >
                <AlertCircle
                  size={18}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="flex-1">{formError}</span>
              </div>
            ) : null}

            {/* Section 1: Basic Identity */}
            <div className="space-y-4">
              <FormSectionHeader
                title="1. Basic Details"
                subtitle="Primary identification, categorization, and catalog display info."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <FormField label="Product Title" required>
                    <div className="relative">
                      <Type
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                      />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                        className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Slug */}
                <FormField
                  label="URL Slug"
                  required
                  hint="Unique path identifier."
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[var(--text-muted)]">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => onChange('slug', e.target.value)}
                      placeholder="sony-wh-1000xm5"
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-8 pr-4 font-mono text-xs font-semibold text-[var(--text-primary)] outline-none transition-all placeholder:font-sans placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>

                {/* Category Dropdown */}
                <FormField label="Category" required>
                  <div className="relative">
                    <Tag
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <select
                      required
                      value={form.categoryId}
                      onChange={(e) => onChange('categoryId', e.target.value)}
                      className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-8 text-sm font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormField>

                {/* Short Description */}
                <div className="sm:col-span-2">
                  <FormField
                    label="Short Description"
                    hint="Brief summary for product cards and listing previews."
                  >
                    <input
                      type="text"
                      value={form.shortDescription}
                      onChange={(e) =>
                        onChange('shortDescription', e.target.value)
                      }
                      placeholder="e.g. Industry-leading noise canceling with two processors."
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </FormField>
                </div>

                {/* Full Description */}
                <div className="sm:col-span-2">
                  <FormField label="Full Description">
                    <div className="relative">
                      <AlignLeft
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[var(--text-muted)]"
                      />
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) =>
                          onChange('description', e.target.value)
                        }
                        placeholder="Detailed specs, features, pros and cons..."
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 py-3 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Affiliate Metadata */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    2. Pricing & Affiliate Links
                  </h3>
                  <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                    Set selling price, MRP, ratings, and affiliate destinations.
                  </p>
                </div>
                {discountPercent !== null && discountPercent > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Percent size={12} strokeWidth={2.5} />
                    {discountPercent}% OFF
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Price */}
                <FormField label="Selling Price (₹)" required>
                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={form.price}
                      onChange={(e) => onChange('price', e.target.value)}
                      placeholder="29990"
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>

                {/* Original Price */}
                <FormField label="Original Price / M.R.P (₹)">
                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.originalPrice}
                      onChange={(e) =>
                        onChange('originalPrice', e.target.value)
                      }
                      placeholder="34990"
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>

                {/* ASIN */}
                <FormField label="Amazon ASIN">
                  <input
                    type="text"
                    value={form.asin}
                    onChange={(e) => onChange('asin', e.target.value)}
                    placeholder="e.g. B09XS7JWHH"
                    className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-4 font-mono text-xs font-semibold uppercase text-[var(--text-primary)] outline-none transition-all placeholder:font-sans placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  />
                </FormField>

                {/* Amazon URL */}
                <FormField label="Affiliate URL">
                  <div className="relative">
                    <LinkIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="url"
                      value={form.amazonUrl}
                      onChange={(e) => onChange('amazonUrl', e.target.value)}
                      placeholder="https://amazon.in/dp/..."
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>

                {/* Rating */}
                <FormField label="Rating (0 to 5)">
                  <div className="relative">
                    <Star
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={form.rating}
                      onChange={(e) => onChange('rating', e.target.value)}
                      placeholder="4.5"
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>

                {/* Review Count */}
                <FormField label="Review Count">
                  <div className="relative">
                    <MessageSquare
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="number"
                      min="0"
                      value={form.reviewCount}
                      onChange={(e) => onChange('reviewCount', e.target.value)}
                      placeholder="1250"
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Section 3: Status & Spotlights */}
            <div className="space-y-4">
              <FormSectionHeader
                title="3. Visibility & Badges"
                subtitle="Toggle storefront presence and promotional badges."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Published */}
                <StatusCard
                  icon={<Eye size={18} />}
                  title="Published"
                  subtitle={form.isPublished ? 'Visible on site' : 'Draft mode'}
                  checked={form.isPublished}
                  activeColor="accent"
                  onChange={(val) => onChange('isPublished', val)}
                />

                {/* Featured */}
                <StatusCard
                  icon={<Sparkles size={18} />}
                  title="Featured"
                  subtitle="Highlight in hero grids"
                  checked={form.isFeatured}
                  activeColor="amber"
                  onChange={(val) => onChange('isFeatured', val)}
                />

                {/* Trending */}
                <StatusCard
                  icon={<TrendingUp size={18} />}
                  title="Trending"
                  subtitle="Include in popular list"
                  checked={form.isTrending}
                  activeColor="orange"
                  onChange={(val) => onChange('isTrending', val)}
                />
              </div>
            </div>
          </div>

          {/* Dialog Action Footer */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-2.5 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-strong)] px-5 text-xs font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-xs font-bold text-slate-950 transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
              <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

{
  /* Shared Helper Components */
}

function FormSectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b border-[var(--border)] pb-2.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{subtitle}</p>
    </div>
  );
}

function FormField({
  label,
  required = false,
  hint,
  children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-xs font-bold text-[var(--text-secondary)]">
        {label}
        {required ? <span className="ml-1 text-[var(--accent)]">*</span> : null}
      </label>
      {children}
      {hint ? (
        <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function StatusCard({
  icon,
  title,
  subtitle,
  checked,
  activeColor,
  onChange
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  activeColor: 'accent' | 'amber' | 'orange';
  onChange: (value: boolean) => void;
}) {
  const activeStyles = {
    accent:
      'border-[var(--accent)] bg-[var(--accent-soft)]/60 text-[var(--accent)]',
    amber: 'border-amber-500/50 bg-amber-500/10 text-amber-500',
    orange: 'border-orange-500/50 bg-orange-500/10 text-orange-500'
  };

  const dotStyles = {
    accent: 'bg-[var(--accent)]',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500'
  };

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
        checked
          ? activeStyles[activeColor]
          : 'border-[var(--border)] bg-[var(--surface-muted)]/30 hover:border-[var(--border-strong)]'
      }`}
      aria-pressed={checked}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
            checked
              ? 'bg-current/15'
              : 'bg-[var(--surface)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
          }`}
        >
          {icon}
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            checked ? dotStyles[activeColor] : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
      </div>

      <div className="mt-3">
        <p className="text-xs font-bold text-[var(--text-primary)]">{title}</p>
        <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
          {subtitle}
        </p>
      </div>
    </button>
  );
}
