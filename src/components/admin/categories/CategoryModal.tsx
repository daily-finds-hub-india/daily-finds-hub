'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Sparkles, Loader2, Upload, Star, Trash2 } from 'lucide-react';
import {
  Category,
  CategoryFormData,
  CategoryImageItem
} from '@/types/category';

interface LocalImageItem extends CategoryImageItem {
  file?: File;
  isNew?: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (
    formData: CategoryFormData,
    images: LocalImageItem[],
    deletedImageIds: string[]
  ) => Promise<void>;
}

const DEFAULT_FORM_DATA: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  isFeatured: false,
  isPublished: true
};

export function CategoryModal({
  isOpen,
  editingCategory,
  isLoading = false,
  onClose,
  onSubmit
}: CategoryModalProps) {
  const [prevCategory, setPrevCategory] = useState<Category | null>(
    editingCategory
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Form State initialized strictly with non-undefined fallback values to prevent input warnings
  const [formData, setFormData] = useState<CategoryFormData>(() =>
    editingCategory
      ? {
          name: editingCategory.name ?? '',
          slug: editingCategory.slug ?? '',
          description: editingCategory.description ?? '',
          isFeatured: Boolean(editingCategory.isFeatured),
          isPublished: Boolean(editingCategory.isPublished)
        }
      : DEFAULT_FORM_DATA
  );

  const [images, setImages] = useState<LocalImageItem[]>(() =>
    editingCategory?.images
      ? editingCategory.images.map((img) => ({ ...img }))
      : []
  );

  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  if (editingCategory !== prevCategory || isOpen !== prevIsOpen) {
    setPrevCategory(editingCategory);
    setPrevIsOpen(isOpen);
    setDeletedImageIds([]);
    setImages(
      editingCategory?.images
        ? editingCategory.images.map((img) => ({ ...img }))
        : []
    );
    setFormData(
      editingCategory
        ? {
            name: editingCategory.name ?? '',
            slug: editingCategory.slug ?? '',
            description: editingCategory.description ?? '',
            isFeatured: Boolean(editingCategory.isFeatured),
            isPublished: Boolean(editingCategory.isPublished)
          }
        : DEFAULT_FORM_DATA
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
      slug: editingCategory ? prev.slug : slugified
    }));
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: LocalImageItem[] = files.map((file, idx) => ({
      file,
      isNew: true,
      url: URL.createObjectURL(file),
      publicId: '',
      altText: formData.name ? `${formData.name} image` : 'Category image',
      isPrimary: images.length === 0 && idx === 0
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl transition-all sm:p-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* 1. Category Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Category Name *
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Smart Home"
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* 2. Slug URL */}
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
              placeholder="smart-home"
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Description
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
              placeholder="Brief summary of items in this category..."
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* 4. Flags */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
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

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-3">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
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

          {/* 5. Image Management Gallery (Placed after all basic details) */}
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Category Gallery & Thumbnail
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Upload multiple images. Mark one as primary for search results
                  and cards.
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
                  category photos.
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
                          alt={img.altText || 'Category image'}
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-slate-950 shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Category...</span>
                </>
              ) : (
                <span>
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
