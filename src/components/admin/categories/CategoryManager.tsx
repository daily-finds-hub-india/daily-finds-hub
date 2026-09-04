'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { ImageUploader } from '../ImageUploader';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { AdminPageHeader } from '../AdminPageHeader';
import { AdminFormDialog } from '../AdminFormDialog';

type CategoryImage = {
  id?: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imagePublicId: string | null;
  images: CategoryImage[];
  isFeatured: boolean;
  _count?: {
    products: number;
  };
};

type FormState = {
  name: string;
  description: string;
  image: string;
  imagePublicId: string;
  images: CategoryImage[];
  isFeatured: boolean;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  image: '',
  imagePublicId: '',
  images: [],
  isFeatured: false
};

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [imageDeleteTarget, setImageDeleteTarget] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/categories', {
        method: 'GET',
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load categories.');
      }

      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeData() {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'GET',
          cache: 'no-store'
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load categories.');
        }

        if (!cancelled) {
          setCategories(data.categories);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load categories.'
          );
          setLoading(false);
        }
      }
    }

    void initializeData();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  }

  function startCreating() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage('');
    setError('');
    setFormOpen(true);
  }

  function startEdit(category: Category) {
    const categoryImages =
      category.images?.length > 0
        ? category.images
        : category.image && category.imagePublicId
          ? [
              {
                url: category.image,
                publicId: category.imagePublicId,
                altText: category.name,
                isPrimary: true
              }
            ]
          : [];

    setEditingId(category.id);
    setFormOpen(true);

    setForm({
      name: category.name,
      description: category.description,
      image: category.image,
      imagePublicId: category.imagePublicId ?? '',
      images: categoryImages,
      isFeatured: category.isFeatured
    });

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function addImage(image: { url: string; publicId: string }) {
    setForm((current) => {
      const newImage: CategoryImage = {
        url: image.url,
        publicId: image.publicId,
        altText: current.name.trim() || 'Category image',
        isPrimary: current.images.length === 0
      };

      return {
        ...current,
        image: current.images.length === 0 ? image.url : current.image,
        imagePublicId:
          current.images.length === 0 ? image.publicId : current.imagePublicId,
        images: [...current.images, newImage]
      };
    });
  }

  function cleanupImage(publicId: string) {
    void fetch('/api/admin/cloudinary/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'categories',
        publicId
      })
    });
  }

  function removePendingImage(index: number) {
    setForm((current) => {
      const updated = current.images.filter(
        (_, imageIndex) => imageIndex !== index
      );

      const removedImage = current.images[index];

      if (removedImage && !removedImage.id) {
        cleanupImage(removedImage.publicId);
      }

      if (updated.length > 0 && !updated.some((image) => image.isPrimary)) {
        updated[0] = {
          ...updated[0],
          isPrimary: true
        };
      }

      const primaryImage = updated.find((image) => image.isPrimary);

      return {
        ...current,
        image: primaryImage?.url ?? '',
        imagePublicId: primaryImage?.publicId ?? '',
        images: updated
      };
    });
  }

  function setPrimaryImage(index: number) {
    setForm((current) => {
      const images = current.images.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === index
      }));

      const primaryImage = images[index];

      return {
        ...current,
        image: primaryImage?.url ?? '',
        imagePublicId: primaryImage?.publicId ?? '',
        images
      };
    });
  }

  function updateImageAltText(index: number, altText: string) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              altText
            }
          : image
      )
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        editingId
          ? `/api/admin/categories/${editingId}`
          : '/api/admin/categories',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            image: form.image,
            imagePublicId: form.imagePublicId || null,
            images: form.images,
            isFeatured: form.isFeatured
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        const firstFieldError = data.errors
          ? Object.values(data.errors).flat()[0]
          : null;

        throw new Error(
          typeof firstFieldError === 'string'
            ? firstFieldError
            : data.message || 'Failed to save category.'
        );
      }

      setMessage(
        editingId
          ? 'Category updated successfully.'
          : 'Category created successfully.'
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    if (category._count && category._count.products > 0) {
      setError(
        `"${category.name}" cannot be deleted because it has products assigned to it.`
      );
      setMessage('');
      setDeleteTarget(null);
      return;
    }

    setDeletingId(category.id);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category.');
      }

      setMessage('Category deleted successfully.');

      if (editingId === category.id) {
        resetForm();
      }

      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete category.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        eyebrow="Category management"
        title="Categories"
        description="Manage the categories shown across Daily Finds Hub."
        action={
          <button
            type="button"
            onClick={startCreating}
            className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            <Plus size={16} />
            Add Category
          </button>
        }
      />

      {message && (
        <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {formOpen ? (
        <AdminFormDialog
          open={formOpen}
          eyebrow={editingId ? 'Edit category' : 'New category'}
          title={editingId ? 'Update category details' : 'Add a category'}
          onClose={resetForm}
          closeDisabled={saving}
        >
          <form
            onSubmit={handleSubmit}
            className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Category Name"
                required
                value={form.name}
                onChange={(value) => updateField('name', value)}
                placeholder="Kitchen"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Featured
                </label>

                <Checkbox
                  label="Feature this category"
                  checked={form.isFeatured}
                  onChange={(value) => updateField('isFeatured', value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                required
                maxLength={300}
                rows={6}
                placeholder="Useful kitchen products and gadgets."
                className="w-full resize-y border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Category Images
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Upload category images to Cloudinary. The first image is
                  primary by default.
                </p>
              </div>

              <ImageUploader type="categories" onUpload={addImage} />

              {form.images.length > 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {form.images.map((image, index) => (
                    <div
                      key={image.id ?? image.publicId}
                      className="border border-[var(--border)] bg-[var(--surface)] p-3"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[var(--surface-muted)]">
                        <Image
                          src={image.url}
                          alt={image.altText}
                          fill
                          className="h-full w-full object-cover"
                        />

                        {image.isPrimary && (
                          <span className="absolute left-3 top-3 bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <label className="mb-2 block text-xs font-medium text-[var(--text-primary)]">
                          Alt text
                        </label>

                        <input
                          type="text"
                          value={image.altText}
                          maxLength={200}
                          onChange={(event) =>
                            updateImageAltText(index, event.target.value)
                          }
                          className="w-full border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                        />
                      </div>

                      <div className="mt-3 flex gap-2">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="border border-[var(--border-strong)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setImageDeleteTarget(index)}
                          className="border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Category'
                    : 'Create Category'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </AdminFormDialog>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Categories
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {categories.length} categor
            {categories.length === 1 ? 'y' : 'ies'} in the database.
          </p>
        </div>

        {loading ? (
          <div className="border border-[var(--border)] p-6 text-sm text-[var(--text-secondary)]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="border border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
            No categories yet. Create your first category above.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[var(--border)]">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Slug</th>
                  <th className="px-4 py-3 text-left font-medium">Featured</th>
                  <th className="px-4 py-3 text-left font-medium">Products</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-md border border-[var(--border)] object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 border border-[var(--border)] bg-[var(--surface-muted)]" />
                        )}

                        <div className="min-w-0">
                          <div className="font-medium text-[var(--text-primary)]">
                            {category.name}
                          </div>

                          <div className="mt-1 text-xs text-[var(--text-secondary)]">
                            {category.images?.length ?? 0} image
                            {(category.images?.length ?? 0) === 1 ? '' : 's'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {category.slug}
                    </td>

                    <td className="px-4 py-4">
                      {category.isFeatured ? (
                        <StatusBadge label="Featured" />
                      ) : (
                        <StatusBadge label="Standard" />
                      )}
                    </td>

                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {category._count?.products ?? 0}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="border border-[var(--border-strong)] px-3 py-2 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          disabled={deletingId === category.id}
                          className="border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === category.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={deleteTarget !== null}
        title="Delete this category?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" cannot be recovered after deletion. Categories with assigned products cannot be deleted.`
            : ''
        }
        isLoading={deleteTarget !== null && deletingId === deleteTarget.id}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            void handleDelete(deleteTarget);
          }
        }}
      />

      <ConfirmationDialog
        open={imageDeleteTarget !== null}
        title="Remove this image?"
        description="This removes the image from the category gallery. Save the category to keep the change."
        confirmLabel="Remove image"
        onCancel={() => setImageDeleteTarget(null)}
        onConfirm={() => {
          if (imageDeleteTarget !== null) {
            removePendingImage(imageDeleteTarget);
            setImageDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
  max,
  step
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 border border-[var(--border)] p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />

      <span className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </span>
    </label>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex border border-[var(--border-strong)] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
      {label}
    </span>
  );
}
