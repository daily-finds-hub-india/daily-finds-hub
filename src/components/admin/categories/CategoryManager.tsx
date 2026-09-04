'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageUploader } from '../ImageUploader';

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

type CategoryImage = {
  id?: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
};

type CategoryForm = {
  name: string;
  description: string;
  image: string;
  imagePublicId: string;
  images: CategoryImage[];
  isFeatured: boolean;
};

const emptyForm: CategoryForm = {
  name: '',
  description: '',
  image: '',
  imagePublicId: '',
  images: [],
  isFeatured: false
};

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadCategories() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'GET',
        cache: 'no-store'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load categories.');
      }

      setCategories(data.categories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load categories.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeCategories() {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'GET',
          cache: 'no-store'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load categories.');
        }

        if (!cancelled) {
          setCategories(data.categories);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load categories.'
          );
          setIsLoading(false);
        }
      }
    }

    void initializeCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  function startCreating() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  }

  function startEditing(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      description: category.description,
      image: category.image,
      imagePublicId: category.imagePublicId ?? '',
      images:
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
            : [],
      isFeatured: category.isFeatured
    });

    setError('');
    setSuccess('');
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  function updateForm<K extends keyof CategoryForm>(
    field: K,
    value: CategoryForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'categories', publicId })
    });
  }

  function removeImage(index: number) {
    setForm((current) => {
      const images = current.images.filter(
        (_, imageIndex) => imageIndex !== index
      );
      const removedImage = current.images[index];

      if (removedImage && !removedImage.id) {
        cleanupImage(removedImage.publicId);
      }
      const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

      return {
        ...current,
        image: primaryImage?.url ?? '',
        imagePublicId: primaryImage?.publicId ?? '',
        images: images.map((image, imageIndex) => ({
          ...image,
          isPrimary: primaryImage
            ? image.publicId === primaryImage.publicId &&
              imageIndex === images.indexOf(primaryImage)
            : false
        }))
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
        image: primaryImage.url,
        imagePublicId: primaryImage.publicId,
        images
      };
    });
  }

  function updateImageAltText(index: number, altText: string) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, altText } : image
      )
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      imagePublicId: form.imagePublicId || null,
      images: form.images,
      isFeatured: form.isFeatured
    };

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
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save category.');
      }

      setSuccess(
        editingId
          ? 'Category updated successfully.'
          : 'Category created successfully.'
      );

      setEditingId(null);
      setForm(emptyForm);

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to save category.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    if (category._count && category._count.products > 0) {
      setError(
        `"${category.name}" cannot be deleted because it has products assigned to it.`
      );
      setSuccess('');
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category.');
      }

      setSuccess('Category deleted successfully.');

      if (editingId === category.id) {
        cancelEditing();
      }

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete category.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-[var(--text-muted)]">
            {categories.length}{' '}
            {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>

        <button
          type="button"
          onClick={startCreating}
          className="bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Add Category
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--accent)]"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          role="status"
          className="border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]"
        >
          {success}
        </div>
      ) : null}

      <section className="border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {editingId ? 'Edit Category' : 'Add Category'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5">
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Name
              </label>

              <input
                id="category-name"
                type="text"
                required
                maxLength={80}
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                placeholder="Kitchen"
                className="w-full border border-[var(--border-strong)] bg-transparent px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
              >
                Description
              </label>

              <textarea
                id="category-description"
                rows={3}
                maxLength={300}
                value={form.description}
                onChange={(event) =>
                  updateForm('description', event.target.value)
                }
                placeholder="Useful kitchen products and gadgets."
                className="w-full resize-y border border-[var(--border-strong)] bg-transparent px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Category image
              </label>

              <ImageUploader type="categories" onUpload={addImage} />

              {form.images.length > 0 ? (
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
                          className="object-cover"
                        />

                        {image.isPrimary ? (
                          <span className="absolute left-3 top-3 bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Primary
                          </span>
                        ) : null}
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
                        {!image.isPrimary ? (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="border border-[var(--border-strong)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          >
                            Set Primary
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : form.image ? (
                <div className="mt-4">
                  <Image
                    src={form.image}
                    alt="Category preview"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-lg border border-[var(--border)] object-cover"
                  />
                </div>
              ) : null}
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  updateForm('isFeatured', event.target.checked)
                }
                className="h-4 w-4"
              />

              <span className="text-sm text-[var(--text-primary)]">
                Feature this category
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? 'Saving...'
                : editingId
                  ? 'Update Category'
                  : 'Create Category'}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                className="border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            All Categories
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-[var(--text-secondary)]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-sm text-[var(--text-secondary)]">
            No categories yet. Create your first category above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 font-medium text-[var(--text-muted)]">
                    Category
                  </th>

                  <th className="px-6 py-3 font-medium text-[var(--text-muted)]">
                    Slug
                  </th>

                  <th className="px-6 py-3 font-medium text-[var(--text-muted)]">
                    Featured
                  </th>

                  <th className="px-6 py-3 font-medium text-[var(--text-muted)]">
                    Products
                  </th>

                  <th className="px-6 py-3 font-medium text-[var(--text-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-6 py-4">
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
                          <div className="h-12 w-12 rounded-md border border-[var(--border)] bg-[var(--surface-muted)]" />
                        )}

                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            {category.name}
                          </p>

                          {category.description ? (
                            <p className="mt-1 max-w-xs truncate text-xs text-[var(--text-muted)]">
                              {category.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {category.slug}
                    </td>

                    <td className="px-6 py-4">
                      {category.isFeatured ? (
                        <span className="text-sm font-medium text-[var(--accent)]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--text-muted)]">
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {category._count?.products ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          className="text-sm font-medium text-[var(--text-primary)] transition hover:text-[var(--accent)]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="text-sm font-medium text-[var(--accent)] transition hover:text-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}
