'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  FolderOpen,
  Star
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageUploader } from '../ImageUploader';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { AdminPageHeader } from '../AdminPageHeader';
import { AdminFormDialog } from '../AdminFormDialog';
import { getAdminCategories } from '@/lib/api/admin-client';

type CategoryImage = {
  id?: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
  displayOrder?: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  images: CategoryImage[];
  _count?: {
    products: number;
  };
};

type FormState = {
  name: string;
  description: string;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  isFeatured: false
};

export function CategoryManager() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const data = await getAdminCategories<{ categories: Category[] }>();
      return data.categories;
    }
  });

  const categories = categoriesQuery.data ?? [];
  const loading = categoriesQuery.isLoading;
  const queryError = categoriesQuery.error;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [imageDeleteTarget, setImageDeleteTarget] = useState<number | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageDeleting, setImageDeleting] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    /*
     * Any images without an ID were uploaded to Cloudinary but
     * have not been saved to CategoryImage yet.
     *
     * If the user closes/cancels the form, clean those uploads up.
     */
    for (const image of images) {
      if (!image.id) {
        cleanupImage(image.publicId);
      }
    }

    setForm(emptyForm);
    setImages([]);
    setEditingId(null);
    setFormOpen(false);
  }

  function startCreating() {
    setForm(emptyForm);
    setImages([]);
    setEditingId(null);
    setMessage('');
    setError('');
    setFormOpen(true);
  }

  async function loadCategoryImages(categoryId: string) {
    const response = await fetch(`/api/admin/categories/${categoryId}/images`, {
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to load category images.');
    }

    return data.images as CategoryImage[];
  }

  async function startEdit(category: Category) {
    setEditingId(category.id);
    setFormOpen(true);

    setForm({
      name: category.name,
      description: category.description,
      isFeatured: category.isFeatured
    });

    setImages([]);
    setMessage('');
    setError('');

    try {
      const categoryImages = await loadCategoryImages(category.id);
      setImages(categoryImages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load category images.'
      );
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function addImage(image: { url: string; publicId: string }) {
    setImages((current) => {
      if (current.length >= 5) {
        setError('A category can have a maximum of 5 images.');
        return current;
      }

      const newImage: CategoryImage = {
        url: image.url,
        publicId: image.publicId,
        altText: form.name.trim() || 'Category image',
        isPrimary: current.length === 0,
        displayOrder: current.length
      };

      return [...current, newImage];
    });

    setError('');
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

  async function createCategoryImage(categoryId: string, image: CategoryImage) {
    const response = await fetch(`/api/admin/categories/${categoryId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: image.url,
        publicId: image.publicId,
        altText: image.altText,
        isPrimary: image.isPrimary
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to save category image.');
    }

    return data.image as CategoryImage;
  }

  async function updateCategoryImage(categoryId: string, image: CategoryImage) {
    if (!image.id) {
      return;
    }

    const response = await fetch(`/api/admin/categories/${categoryId}/images`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageId: image.id,
        altText: image.altText,
        isPrimary: image.isPrimary
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to update category image.');
    }
  }

  async function deleteCategoryImage(categoryId: string, imageId: string) {
    const response = await fetch(`/api/admin/categories/${categoryId}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageId
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete category image.');
    }
  }

  function removePendingImage(index: number) {
    setImages((current) => {
      const removedImage = current[index];

      if (!removedImage) {
        return current;
      }

      const updated = current.filter((_, imageIndex) => imageIndex !== index);

      if (!removedImage.id) {
        cleanupImage(removedImage.publicId);
      }

      if (updated.length > 0 && !updated.some((image) => image.isPrimary)) {
        updated[0] = {
          ...updated[0],
          isPrimary: true
        };
      }

      return updated.map((image, imageIndex) => ({
        ...image,
        displayOrder: imageIndex
      }));
    });
  }

  function setPrimaryImage(index: number) {
    setImages((current) =>
      current.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === index
      }))
    );
  }

  function updateImageAltText(index: number, altText: string) {
    setImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              altText
            }
          : image
      )
    );
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

      const categoryId = data.category.id as string;

      /*
       * Existing CategoryImage records already have an ID.
       * Images without an ID are new Cloudinary uploads and
       * need to be inserted into CategoryImage.
       */
      const pendingImages = images.filter((image) => !image.id);
      const existingImages = images.filter((image) => image.id);

      /*
       * Save newly uploaded images.
       */
      for (const image of pendingImages) {
        await createCategoryImage(categoryId, image);
      }

      /*
       * Save changes to existing images:
       * - primary state
       * - alt text
       */
      if (editingId) {
        for (const image of existingImages) {
          await updateCategoryImage(categoryId, image);
        }
      }

      setMessage(
        editingId
          ? 'Category updated successfully.'
          : 'Category created successfully.'
      );

      /*
       * Clear local form state without calling resetForm(),
       * because all uploaded images have now been persisted.
       */
      setForm(emptyForm);
      setImages([]);
      setEditingId(null);
      setFormOpen(false);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin', 'categories']
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin', 'products']
        })
      ]);
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
        /*
         * The category is gone, so clear local state directly.
         * Do not run resetForm() because there are no unsaved
         * uploads associated with a deleted category.
         */
        setForm(emptyForm);
        setImages([]);
        setEditingId(null);
        setFormOpen(false);
      }

      setDeleteTarget(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin', 'categories']
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin', 'products']
        })
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete category.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleImageDelete() {
    if (imageDeleteTarget === null) {
      return;
    }

    const image = images[imageDeleteTarget];

    if (!image) {
      setImageDeleteTarget(null);
      return;
    }

    /*
     * New upload:
     * It only exists in Cloudinary and local state.
     */
    if (!image.id) {
      removePendingImage(imageDeleteTarget);
      setImageDeleteTarget(null);
      return;
    }

    if (!editingId) {
      setImageDeleteTarget(null);
      return;
    }

    setImageDeleting(true);
    setError('');

    try {
      await deleteCategoryImage(editingId, image.id);

      setImages((current) => {
        const updated = current.filter(
          (_, index) => index !== imageDeleteTarget
        );

        if (updated.length > 0 && !updated.some((item) => item.isPrimary)) {
          updated[0] = {
            ...updated[0],
            isPrimary: true
          };
        }

        return updated.map((item, index) => ({
          ...item,
          displayOrder: index
        }));
      });

      setMessage('Category image deleted successfully.');
      setImageDeleteTarget(null);

      await queryClient.invalidateQueries({
        queryKey: ['admin', 'categories']
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete category image.'
      );
    } finally {
      setImageDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        eyebrow="Category Catalog"
        title="Categories"
        description="Manage the categories used to organize products across Daily Finds Hub."
        action={
          <button
            type="button"
            onClick={startCreating}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Category
          </button>
        }
      />

      {message && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {(error || queryError) && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={18} />
          <span>
            {error ||
              (queryError instanceof Error
                ? queryError.message
                : 'Failed to load category data.')}
          </span>
        </div>
      )}

      {formOpen ? (
        <AdminFormDialog
          open={formOpen}
          eyebrow={editingId ? 'Edit Category' : 'New Category'}
          title={editingId ? 'Update Category Details' : 'Add a New Category'}
          onClose={resetForm}
          closeDisabled={saving}
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto p-6 sm:p-8"
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
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Category Status
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/20 p-3.5 transition hover:bg-[var(--surface-muted)]/50">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateField('isFeatured', event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
                  />

                  <div>
                    <span className="block text-sm font-bold text-[var(--text-primary)]">
                      Feature this category
                    </span>

                    <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                      Highlight this category on the homepage.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                required
                maxLength={300}
                rows={5}
                placeholder="Useful kitchen products and gadgets."
                className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-5 sm:p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <FolderOpen size={16} />
                  Category Imagery
                </h3>

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Upload category images. The first image is automatically
                  selected as the primary image.
                </p>
              </div>

              <ImageUploader type="categories" onUpload={addImage} />

              {images.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image.id ?? image.publicId}-${index}`}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                        <Image
                          src={image.url}
                          alt={image.altText}
                          fill
                          className="object-cover"
                        />

                        {image.isPrimary && (
                          <span className="absolute left-2.5 top-2.5 rounded-lg bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-xs">
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                          Alt text
                        </label>

                        <input
                          type="text"
                          value={image.altText}
                          maxLength={200}
                          onChange={(event) =>
                            updateImageAltText(index, event.target.value)
                          }
                          className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] transition focus:border-[var(--accent)] focus:outline-none"
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="flex-1 rounded-lg border border-[var(--border-strong)] py-1.5 text-center text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setImageDeleteTarget(index)}
                          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-xl border border-[var(--border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </AdminFormDialog>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              All Categories
            </h2>

            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {categories.length} categor
              {categories.length === 1 ? 'y' : 'ies'} registered in database
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-sm text-[var(--text-secondary)]">
            Loading categories catalog...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
              <FolderOpen size={24} />
            </div>

            <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
              No categories found
            </h3>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Get started by adding your first product category.
            </p>

            <button
              type="button"
              onClick={startCreating}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-[var(--accent-hover)]"
            >
              <Plus size={14} />
              Add First Category
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/50 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Featured</th>
                    <th className="px-5 py-4">Products</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border)]">
                  {categories.map((category) => {
                    const primaryImage =
                      category.images?.find((image) => image.isPrimary) ??
                      category.images?.[0];

                    return (
                      <tr
                        key={category.id}
                        className="transition-colors hover:bg-[var(--surface-muted)]/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {primaryImage ? (
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]">
                                <Image
                                  src={primaryImage.url}
                                  alt={primaryImage.altText || category.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
                                <FolderOpen size={18} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--text-primary)]">
                                {category.name}
                              </div>

                              <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                                {category.images?.length ?? 0} image
                                {(category.images?.length ?? 0) === 1
                                  ? ''
                                  : 's'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-[var(--text-secondary)]">
                          {category.slug}
                        </td>

                        <td className="px-5 py-4">
                          {category.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                              <Star size={11} className="fill-current" />
                              Featured
                            </span>
                          ) : (
                            <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Standard
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-[var(--text-secondary)]">
                          {category._count?.products ?? 0}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void startEdit(category)}
                              className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(category)}
                              disabled={deletingId === category.id}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={13} />
                              <span>
                                {deletingId === category.id
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
        description={
          imageDeleteTarget !== null && images[imageDeleteTarget]?.id
            ? 'This permanently removes the image from the category gallery and Cloudinary.'
            : 'This removes the uploaded image from the category gallery.'
        }
        confirmLabel="Remove Image"
        isLoading={imageDeleting}
        onCancel={() => {
          if (!imageDeleting) {
            setImageDeleteTarget(null);
          }
        }}
        onConfirm={() => {
          void handleImageDelete();
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
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
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
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
      />
    </div>
  );
}
