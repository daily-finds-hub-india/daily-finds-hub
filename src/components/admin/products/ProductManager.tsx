'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageUploader } from '../ImageUploader';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { AdminPageHeader } from '../AdminPageHeader';
import { Plus } from 'lucide-react';
import { AdminFormDialog } from '../AdminFormDialog';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
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

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/admin/products', {
          cache: 'no-store'
        }),
        fetch('/api/admin/categories', {
          cache: 'no-store'
        })
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsResponse.ok || !productsData.success) {
        throw new Error(productsData.message || 'Failed to load products.');
      }

      if (!categoriesResponse.ok || !categoriesData.success) {
        throw new Error(categoriesData.message || 'Failed to load categories.');
      }

      setProducts(productsData.products);
      setCategories(categoriesData.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load product data.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeData() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/admin/products', {
            cache: 'no-store'
          }),
          fetch('/api/admin/categories', {
            cache: 'no-store'
          })
        ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!productsResponse.ok || !productsData.success) {
          throw new Error(productsData.message || 'Failed to load products.');
        }

        if (!categoriesResponse.ok || !categoriesData.success) {
          throw new Error(
            categoriesData.message || 'Failed to load categories.'
          );
        }

        if (!cancelled) {
          setProducts(productsData.products);
          setCategories(categoriesData.categories);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load product data.'
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
      await loadData();
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

      if (editingId === id) {
        resetForm();
      }

      setDeleteTarget(null);

      await loadData();
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
        eyebrow="Product management"
        title="Products"
        description="Manage the products shown across Daily Finds Hub."
        action={
          <button
            type="button"
            onClick={startCreating}
            className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus size={16} />
            Add Product
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
          eyebrow={editingId ? 'Edit product' : 'New product'}
          title={editingId ? 'Update product details' : 'Add a product'}
          onClose={resetForm}
          closeDisabled={saving}
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto p-6"
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
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField('categoryId', event.target.value)
                  }
                  required
                  className="w-full border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
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
              placeholder="A compact description for product cards."
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                required
                rows={6}
                placeholder="Detailed product description..."
                className="w-full resize-y border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Price"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(value) => updateField('price', value)}
                placeholder="999"
              />

              <Field
                label="Original Price"
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(value) => updateField('originalPrice', value)}
                placeholder="1499"
              />

              <Field
                label="Rating"
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
                placeholder="https://www.amazon.in/..."
              />

              <Field
                label="ASIN"
                value={form.asin}
                onChange={(value) => updateField('asin', value)}
                placeholder="B0XXXXXXXX"
              />
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Upload product images to Cloudinary. The first image is
                  primary by default.
                </p>
              </div>

              <ImageUploader type="products" onUpload={addImage} />

              {images.length > 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={image.publicId}
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

            <div className="grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
              <Checkbox
                label="Featured"
                checked={form.isFeatured}
                onChange={(value) => updateField('isFeatured', value)}
              />

              <Checkbox
                label="Trending"
                checked={form.isTrending}
                onChange={(value) => updateField('isTrending', value)}
              />

              <Checkbox
                label="Published"
                checked={form.isPublished}
                onChange={(value) => updateField('isPublished', value)}
              />
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
                    ? 'Update Product'
                    : 'Create Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)]"
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
            Products
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {products.length} product
            {products.length === 1 ? '' : 's'} in the database.
          </p>
        </div>

        {loading ? (
          <div className="border border-[var(--border)] p-6 text-sm text-[var(--text-secondary)]">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
            No products yet. Create your first product above.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[var(--border)]">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Rating</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-[var(--text-primary)]">
                        {product.name}
                      </div>

                      <div className="mt-1 text-xs text-[var(--text-secondary)]">
                        {product._count.images} image
                        {product._count.images === 1 ? '' : 's'}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {product.category.name}
                    </td>

                    <td className="px-4 py-4 text-[var(--text-primary)]">
                      ₹{product.price}
                    </td>

                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {product.rating} ({product.reviewCount})
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isPublished && (
                          <StatusBadge label="Published" />
                        )}

                        {product.isFeatured && <StatusBadge label="Featured" />}

                        {product.isTrending && <StatusBadge label="Trending" />}

                        {!product.isPublished &&
                          !product.isFeatured &&
                          !product.isTrending && <StatusBadge label="Draft" />}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="border border-[var(--border-strong)] px-3 py-2 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product.id)}
                          className="border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
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
        title="Delete this product?"
        description="This removes the product and its associated images from the catalog. This action cannot be undone."
        isLoading={deleteTarget !== null && deletingId === deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) void handleDelete(deleteTarget);
        }}
      />

      <ConfirmationDialog
        open={imageDeleteTarget !== null}
        title="Remove this image?"
        description="This removes the image from the product gallery. Save the product to keep the change."
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
        className="w-full border border-[var(--border-strong)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
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
