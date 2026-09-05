'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageUploader } from '../ImageUploader';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { AdminPageHeader } from '../AdminPageHeader';
import { Plus, Star, CheckCircle2, AlertCircle, Edit3, Trash2, Package } from 'lucide-react';
import { AdminFormDialog } from '../AdminFormDialog';
import { getAdminCategories, getAdminProducts } from '@/lib/api/admin-client';

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id?: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string;
  originalPrice: string | null;
  rating: string;
  reviewCount: number;
  amazonUrl: string | null;
  asin: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  category: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  _count: {
    images: number;
  };
};

type FormState = {
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviewCount: string;
  amazonUrl: string;
  asin: string;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
};

const emptyForm: FormState = {
  name: '',
  shortDescription: '',
  description: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  rating: '0',
  reviewCount: '0',
  amazonUrl: '',
  asin: '',
  isFeatured: false,
  isTrending: false,
  isPublished: false
};

export function ProductManager() {
  const queryClient = useQueryClient();
  const productsQuery = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const data = await getAdminProducts<{ products: Product[] }>();
      return data.products;
    }
  });
  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const data = await getAdminCategories<{ categories: Category[] }>();
      return data.categories;
    }
  });
  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const loading = productsQuery.isLoading || categoriesQuery.isLoading;
  const queryError = productsQuery.error ?? categoriesQuery.error;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [imageDeleteTarget, setImageDeleteTarget] = useState<number | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  function startEdit(product: Product) {
    setEditingId(product.id);
    setFormOpen(true);

    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      originalPrice: product.originalPrice ?? '',
      rating: product.rating,
      reviewCount: String(product.reviewCount),
      amazonUrl: product.amazonUrl ?? '',
      asin: product.asin ?? '',
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isPublished: product.isPublished
    });

    setImages(product.images ?? []);

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function addImage(image: { url: string; publicId: string }) {
    setImages((current) => {
      const newImage: ProductImage = {
        url: image.url,
        publicId: image.publicId,
        altText: form.name.trim() || 'Product image',
        isPrimary: current.length === 0
      };

      return [...current, newImage];
    });
  }

  function cleanupImage(publicId: string) {
    void fetch('/api/admin/cloudinary/cleanup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'products', publicId })
    });
  }

  function removePendingImage(index: number) {
    setImages((current) => {
      const updated = current.filter((_, imageIndex) => imageIndex !== index);
      const removedImage = current[index];

      if (removedImage && !removedImage.id) {
        cleanupImage(removedImage.publicId);
      }

      if (updated.length > 0 && !updated.some((image) => image.isPrimary)) {
        updated[0] = {
          ...updated[0],
          isPrimary: true
        };
      }

      return updated;
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        editingId ? `/api/admin/products/${editingId}` : '/api/admin/products',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : '',
            rating: Number(form.rating),
            reviewCount: Number(form.reviewCount),
            images
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
            : data.message || 'Failed to save product.'
        );
      }

      setMessage(
        editingId
          ? 'Product updated successfully.'
          : 'Product created successfully.'
      );

      resetForm();
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'products']
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product.');
      }

      setMessage('Product deleted successfully.');
      setDeleteTarget(null);
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'products']
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete product.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        eyebrow="Product Catalog"
        title="Products"
        description="Manage the inventory, pricing, images, and Amazon affiliate links for Daily Finds Hub."
        action={
          <button
            type="button"
            onClick={startCreating}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Product
          </button>
        }
      />

      {message && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {(error || queryError) && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400 animate-in fade-in">
          <AlertCircle size={18} />
          <span>{error || (queryError instanceof Error ? queryError.message : 'Failed to load product data.')}</span>
        </div>
      )}

      {formOpen ? (
        <AdminFormDialog
          open={formOpen}
          eyebrow={editingId ? 'Edit Product' : 'New Product'}
          title={editingId ? 'Update Product Details' : 'Add a New Product'}
          onClose={resetForm}
          closeDisabled={saving}
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto p-6 sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Product Name"
                required
                value={form.name}
                onChange={(value) => updateField('name', value)}
                placeholder="Mini Electric Chopper"
              />

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField('categoryId', event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Field
              label="Short Description"
              required
              value={form.shortDescription}
              onChange={(value) => updateField('shortDescription', value)}
              placeholder="A compact teaser for cards and search snippets."
            />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Full Description / Review <span className="text-red-500">*</span>
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                required
                rows={5}
                placeholder="Detailed product review, key specifications, and why users will love it..."
                className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/40 px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Price (₹)"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(value) => updateField('price', value)}
                placeholder="999"
              />

              <Field
                label="Original Price (₹)"
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(value) => updateField('originalPrice', value)}
                placeholder="1499"
              />

              <Field
                label="Rating (out of 5)"
                required
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(value) => updateField('rating', value)}
                placeholder="4.5"
              />

              <Field
                label="Review Count"
                required
                type="number"
                min="0"
                step="1"
                value={form.reviewCount}
                onChange={(value) => updateField('reviewCount', value)}
                placeholder="1250"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Amazon Affiliate URL"
                type="url"
                value={form.amazonUrl}
                onChange={(value) => updateField('amazonUrl', value)}
                placeholder="https://www.amazon.in/dp/.../?tag=yourtag"
              />

              <Field
                label="Amazon ASIN"
                value={form.asin}
                onChange={(value) => updateField('asin', value.toUpperCase())}
                placeholder="B08N5WRWNW"
              />
            </div>

            {/* Images Upload Section */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-5 sm:p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Product Imagery
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Upload crisp photos. The first image is the primary hero image.
                </p>
              </div>

              <ImageUploader type="products" onUpload={addImage} />

              {images.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={image.publicId}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xs"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                        <Image
                          src={image.url}
                          alt={image.altText}
                          fill
                          className="h-full w-full object-cover"
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

            {/* Visibility & Tags */}
            <div className="grid gap-3.5 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
              <Checkbox
                label="Featured"
                description="Pin to top carousel & homepage spotlight"
                checked={form.isFeatured}
                onChange={(value) => updateField('isFeatured', value)}
              />

              <Checkbox
                label="Trending"
                description="Highlight with glowing Trending badge"
                checked={form.isTrending}
                onChange={(value) => updateField('isTrending', value)}
              />

              <Checkbox
                label="Published"
                description="Visible immediately to store visitors"
                checked={form.isPublished}
                onChange={(value) => updateField('isPublished', value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Product'
                    : 'Create Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[var(--border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </AdminFormDialog>
      ) : null}

      {/* Catalog Table Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              All Products
            </h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {products.length} product{products.length === 1 ? '' : 's'} registered in database
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-sm text-[var(--text-secondary)]">
            Loading products catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
              <Package size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
              No products found
            </h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Get started by adding your first product to the catalog.
            </p>
            <button
              type="button"
              onClick={startCreating}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[var(--accent-hover)]"
            >
              <Plus size={14} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]/50 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Rating</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border)]">
                  {products.map((product) => {
                    const primaryImg = product.images?.find((img) => img.isPrimary) || product.images?.[0];
                    return (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-[var(--surface-muted)]/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {primaryImg ? (
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]">
                                <Image
                                  src={primaryImg.url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
                                <Package size={18} />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-[var(--text-primary)]">
                                {product.name}
                              </div>
                              <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                                {product._count.images} image{product._count.images === 1 ? '' : 's'}
                                {product.asin && ` • ASIN: ${product.asin}`}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-[var(--text-secondary)]">
                          {product.category.name}
                        </td>

                        <td className="px-5 py-4 font-bold text-[var(--text-primary)]">
                          ₹{product.price}
                          {product.originalPrice && (
                            <span className="ml-1.5 text-xs font-normal text-[var(--text-muted)] line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                          <div className="flex items-center gap-1">
                            <Star size={13} className="fill-[var(--accent)] text-[var(--accent)]" />
                            <span className="font-semibold text-[var(--text-primary)]">{product.rating}</span>
                            <span className="text-[var(--text-muted)]">({product.reviewCount})</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {product.isPublished ? (
                              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Live
                              </span>
                            ) : (
                              <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Draft
                              </span>
                            )}

                            {product.isFeatured && (
                              <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                Featured
                              </span>
                            )}

                            {product.isTrending && (
                              <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                                Trending
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(product)}
                              className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
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
        title="Delete this product?"
        description="This will permanently remove the product and its associated gallery from the catalog. This action cannot be undone."
        isLoading={deleteTarget !== null && deletingId === deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) void handleDelete(deleteTarget);
        }}
      />

      <ConfirmationDialog
        open={imageDeleteTarget !== null}
        title="Remove this image?"
        description="This removes the image from the product gallery. Save the product to persist the change."
        confirmLabel="Remove Image"
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

function Checkbox({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/20 p-3.5 transition hover:bg-[var(--surface-muted)]/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
      />

      <div>
        <span className="block text-sm font-bold text-[var(--text-primary)]">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}
