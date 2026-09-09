'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  Flame,
  Loader2,
  Upload,
  Star,
  Trash2
} from 'lucide-react';
import { Product, ProductFormData, ProductImageItem } from '@/types/product';

interface LocalProductImageItem extends ProductImageItem {
  file?: File;
  isNew?: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (
    formData: ProductFormData,
    images: LocalProductImageItem[],
    deletedImageIds: string[]
  ) => Promise<void> | void;
}

const DEFAULT_PRODUCT_FORM: ProductFormData = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  rating: '',
  reviewCount: '',
  amazonUrl: '',
  asin: '',
  isFeatured: false,
  isTrending: false,
  isPublished: false
};

function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name ?? '',
    slug: product.slug ?? '',
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    categoryId: product.categoryId ?? '',
    price: product.price !== undefined ? product.price.toString() : '',
    originalPrice:
      product.originalPrice !== null && product.originalPrice !== undefined
        ? product.originalPrice.toString()
        : '',
    rating:
      product.rating !== null && product.rating !== undefined
        ? product.rating.toString()
        : '',
    reviewCount:
      product.reviewCount !== undefined ? product.reviewCount.toString() : '',
    amazonUrl: product.amazonUrl ?? '',
    asin: product.asin ?? '',
    isFeatured: Boolean(product.isFeatured),
    isTrending: Boolean(product.isTrending),
    isPublished: Boolean(product.isPublished)
  };
}

export function ProductModal({
  isOpen,
  editingProduct,
  categories = [],
  isLoading = false,
  onClose,
  onSubmit
}: ProductModalProps) {
  const [prevProduct, setPrevProduct] = useState<Product | null>(
    editingProduct
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [formData, setFormData] = useState<ProductFormData>(() =>
    editingProduct ? productToFormData(editingProduct) : DEFAULT_PRODUCT_FORM
  );

  const [images, setImages] = useState<LocalProductImageItem[]>(() =>
    editingProduct?.images
      ? editingProduct.images.map((img) => ({ ...img }))
      : []
  );

  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  if (editingProduct !== prevProduct || isOpen !== prevIsOpen) {
    setPrevProduct(editingProduct);
    setPrevIsOpen(isOpen);
    setDeletedImageIds([]);
    setImages(
      editingProduct?.images
        ? editingProduct.images.map((img) => ({ ...img }))
        : []
    );
    setFormData(
      editingProduct ? productToFormData(editingProduct) : DEFAULT_PRODUCT_FORM
    );
  }

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingProduct ? prev.slug : slugified
    }));
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: LocalProductImageItem[] = files.map((file, idx) => ({
      file,
      isNew: true,
      url: URL.createObjectURL(file),
      publicId: '',
      altText: formData.name ? `${formData.name} image` : 'Product image',
      isPrimary: images.length === 0 && idx === 0,
      displayOrder: images.length + idx
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const handleAltTextChange = (index: number, altText: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, altText } : img))
    );
  };

  const handleRemoveImage = (index: number) => {
    const target = images[index];
    if (target.id) {
      setDeletedImageIds((prev) => [...prev, target.id!]);
    }

    const updated = images.filter((_, i) => i !== index);
    if (target.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, images, deletedImageIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Card Container */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all">
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-4 sm:p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] hover:[&::-webkit-scrollbar-thumb]:bg-[var(--text-muted)]"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Product Name *
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Wireless Mechanical Keyboard"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Slug URL *
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="wireless-mechanical-keyboard"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Category *
              </label>
              <select
                required
                disabled={isLoading}
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value
                  }))
                }
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-semibold text-[var(--text-secondary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                disabled={isLoading}
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="2499"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Original Price (₹)
              </label>
              <input
                type="number"
                disabled={isLoading}
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalPrice: e.target.value
                  }))
                }
                placeholder="3499"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Rating (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                disabled={isLoading}
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rating: e.target.value }))
                }
                placeholder="4.5"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Review Count */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Reviews Count
              </label>
              <input
                type="number"
                disabled={isLoading}
                value={formData.reviewCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewCount: e.target.value
                  }))
                }
                placeholder="1284"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* ASIN */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                ASIN Code
              </label>
              <input
                type="text"
                disabled={isLoading}
                value={formData.asin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, asin: e.target.value }))
                }
                placeholder="B000000001"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Amazon URL */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Amazon URL
              </label>
              <input
                type="url"
                disabled={isLoading}
                value={formData.amazonUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amazonUrl: e.target.value
                  }))
                }
                placeholder="https://amazon.in/..."
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Short Description
            </label>
            <input
              type="text"
              disabled={isLoading}
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value
                }))
              }
              placeholder="Brief overview line..."
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Full Description
            </label>
            <textarea
              rows={3}
              disabled={isLoading}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder="Detailed product information..."
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Featured
                </span>
              </div>
              <input
                type="checkbox"
                disabled={isLoading}
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)] disabled:opacity-50"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-2.5">
              <div className="flex items-center gap-1.5">
                <Flame size={13} className="text-rose-400" />
                <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Trending
                </span>
              </div>
              <input
                type="checkbox"
                disabled={isLoading}
                checked={formData.isTrending}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isTrending: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)] disabled:opacity-50"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-2.5">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Published
              </span>
              <input
                type="checkbox"
                disabled={isLoading}
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)] disabled:opacity-50"
              />
            </label>
          </div>

          {/* Product Gallery & Thumbnail Management */}
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Product Gallery & Thumbnail
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Upload multiple product images. Mark one as primary thumbnail.
                </p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                <Upload size={14} />
                <span>Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isLoading}
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </label>
            </div>

            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/20 p-6 text-center text-xs text-[var(--text-muted)]">
                <Upload size={24} className="mb-2 text-[var(--text-muted)]" />
                <span>
                  No images attached yet. Click &quot;Add Images&quot; to select
                  photos.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id || img.url || idx}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                      img.isPrimary
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20'
                        : 'border-[var(--border)] bg-[var(--surface-muted)]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-black/5">
                        <Image
                          src={img.url}
                          alt={img.altText || 'Product image'}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          disabled={isLoading}
                          value={img.altText}
                          onChange={(e) =>
                            handleAltTextChange(idx, e.target.value)
                          }
                          placeholder="Image Alt Text (SEO)"
                          className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border)] pt-2 sm:pt-0">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSetPrimary(idx)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          img.isPrimary
                            ? 'bg-[var(--accent)] text-slate-950 font-bold'
                            : 'border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
                        }`}
                      >
                        <Star
                          size={13}
                          className={img.isPrimary ? 'fill-slate-950' : ''}
                        />
                        <span>
                          {img.isPrimary
                            ? 'Primary Thumbnail'
                            : 'Set as Primary'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleRemoveImage(idx)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isLoading}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-slate-950 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
