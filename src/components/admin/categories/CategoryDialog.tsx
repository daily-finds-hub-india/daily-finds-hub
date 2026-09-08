import { type FormEvent, type ReactNode } from 'react';
import {
  AlertCircle,
  AlignLeft,
  Check,
  Edit3,
  Globe,
  Info,
  Link2,
  Plus,
  Sparkles,
  Type,
  UploadCloud,
  X
} from 'lucide-react';
import { Category, CategoryFormData } from '@/types/category';

interface CategoryDialogProps {
  editingCategory: Category | null;
  form: CategoryFormData;
  formError: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof CategoryFormData>(
    key: K,
    value: CategoryFormData[K]
  ) => void;
}

export function CategoryDialog({
  editingCategory,
  form,
  formError,
  onClose,
  onSubmit,
  onChange
}: CategoryDialogProps) {
  function handleNameChange(value: string) {
    onChange('name', value);
    if (!editingCategory) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
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
        aria-labelledby="category-dialog-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-h-[88dvh] sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] via-amber-400 to-orange-500" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-xs">
              {editingCategory ? (
                <Edit3 size={20} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Plus size={22} strokeWidth={2.2} aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="category-dialog-title"
                  className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl"
                >
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {editingCategory ? 'Update' : 'Drafting'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {editingCategory
                  ? 'Update settings and visibility for this category.'
                  : 'Add a new category to organize your affiliate products.'}
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

            {/* General Info Section */}
            <div className="space-y-4">
              <FormSectionHeader
                title="General Details"
                subtitle="Primary identification parameters for search & navigation."
              />

              <div className="space-y-4">
                {/* Category Name */}
                <FormField label="Category Name" required>
                  <div className="relative">
                    <Type
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Smart Home & Audio"
                      maxLength={100}
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      required
                    />
                  </div>
                </FormField>

                {/* Slug */}
                <FormField
                  label="URL Slug"
                  required
                  hint="Unique URL path identifier. Lowercase letters, numbers, and hyphens."
                >
                  <div className="relative">
                    <Link2
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        onChange(
                          'slug',
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-')
                        )
                      }
                      placeholder="smart-home-audio"
                      maxLength={100}
                      className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 pl-10 pr-4 font-mono text-xs font-semibold text-[var(--text-primary)] outline-none transition-all placeholder:font-sans placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                      required
                    />
                  </div>
                </FormField>

                {/* Description */}
                <FormField
                  label="Description"
                  hint="Optional description for SEO and catalog tooltips."
                >
                  <div className="relative">
                    <AlignLeft
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-3.5 text-[var(--text-muted)]"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) => onChange('description', e.target.value)}
                      placeholder="Describe the products listed under this category..."
                      rows={3}
                      maxLength={1000}
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 py-3 pl-10 pr-4 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-[10px] font-semibold ${
                        form.description.length > 900
                          ? 'text-amber-500'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {form.description.length} / 1000
                    </span>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Visibility & Discovery Section */}
            <div className="space-y-4">
              <FormSectionHeader
                title="Visibility & Discovery"
                subtitle="Manage catalog status and feature spots on the storefront."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <SwitchCard
                  icon={<Globe size={18} />}
                  title="Published"
                  description="Make category visible to website visitors."
                  checked={form.isPublished}
                  onChange={(val) => onChange('isPublished', val)}
                />

                <SwitchCard
                  icon={<Sparkles size={18} />}
                  title="Featured"
                  description="Promote in homepage feature grids."
                  checked={form.isFeatured}
                  onChange={(val) => onChange('isFeatured', val)}
                />
              </div>
            </div>

            {/* Category Image Upload Dropzone Section */}
            <div className="space-y-4">
              <FormSectionHeader
                title="Category Thumbnail"
                subtitle="Visual card image displayed in category directories."
              />

              <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)]/30 p-6 text-center transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--surface-muted)]/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--text-muted)] shadow-xs transition-transform group-hover:scale-110 group-hover:text-[var(--accent)]">
                  <UploadCloud size={22} strokeWidth={1.8} />
                </div>

                <div className="mt-3">
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    Cloudinary Image Upload
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    Drag and drop image here or click to browse (PNG, JPG, WebP)
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
                  <Info size={12} className="text-[var(--accent)]" />
                  <span>
                    Cloudinary pipeline will automatically optimize image asset
                  </span>
                </div>
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
              <span>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

{
  /* Helper Components */
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

function SwitchCard({
  icon,
  title,
  description,
  checked,
  onChange
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`group relative flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
        checked
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]/60 shadow-xs'
          : 'border-[var(--border)] bg-[var(--surface-muted)]/30 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]/60'
      }`}
      aria-pressed={checked}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            checked
              ? 'bg-[var(--accent)] text-slate-950'
              : 'bg-[var(--surface)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
          }`}
        >
          {icon}
        </div>

        <div>
          <span className="block text-xs font-bold text-[var(--text-primary)]">
            {title}
          </span>
          <span className="mt-0.5 block text-[10px] leading-relaxed text-[var(--text-muted)]">
            {description}
          </span>
        </div>
      </div>

      {/* Switch Toggle Control */}
      <div
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[var(--accent)]' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
