'use client';

import { useState } from 'react';
import { X, Sparkles, Flame } from 'lucide-react';
import { Product, ProductFormData } from '@/types/product';
import { categories, emptyForm } from '@/lib/constants/productConstants';

interface ProductModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
}

function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    categoryId: product.categoryId,
    price: product.price.toString(),
    originalPrice: product.originalPrice
      ? product.originalPrice.toString()
      : '',
    rating: product.rating ? product.rating.toString() : '',
    reviewCount: product.reviewCount ? product.reviewCount.toString() : '',
    amazonUrl: product.amazonUrl || '',
    asin: product.asin || '',
    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    isPublished: product.isPublished
  };
}

export function ProductModal({
  isOpen,
  editingProduct,
  onClose,
  onSubmit
}: ProductModalProps) {
  const [prevProduct, setPrevProduct] = useState<Product | null>(
    editingProduct
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [formData, setFormData] = useState<ProductFormData>(() =>
    editingProduct ? productToFormData(editingProduct) : emptyForm
  );

  if (editingProduct !== prevProduct || isOpen !== prevIsOpen) {
    setPrevProduct(editingProduct);
    setPrevIsOpen(isOpen);
    setFormData(editingProduct ? productToFormData(editingProduct) : emptyForm);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card Container: overflow-hidden keeps rounded corners intact */}
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all">
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body with Custom Slim Scrollbar */}
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
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Wireless Mechanical Keyboard"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="wireless-mechanical-keyboard"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value
                  }))
                }
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-semibold text-[var(--text-secondary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="2499"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalPrice: e.target.value
                  }))
                }
                placeholder="3499"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rating: e.target.value }))
                }
                placeholder="4.5"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
              />
            </div>

            {/* Review Count */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Reviews Count
              </label>
              <input
                type="number"
                value={formData.reviewCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewCount: e.target.value
                  }))
                }
                placeholder="1284"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
              />
            </div>

            {/* ASIN */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                ASIN Code
              </label>
              <input
                type="text"
                value={formData.asin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, asin: e.target.value }))
                }
                placeholder="B000000001"
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
              />
            </div>

            {/* Amazon URL */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Amazon URL
              </label>
              <input
                type="url"
                value={formData.amazonUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amazonUrl: e.target.value
                  }))
                }
                placeholder="https://amazon.in/..."
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value
                }))
              }
              placeholder="Brief overview line..."
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Full Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder="Detailed product information..."
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3 text-xs font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
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
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
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
                checked={formData.isTrending}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isTrending: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-2.5">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Published
              </span>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: e.target.checked
                  }))
                }
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
              />
            </label>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className="h-9 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
