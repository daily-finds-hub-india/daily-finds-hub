'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Category, CategoryFormData } from '@/types/category';

interface CategoryModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => void;
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
  onClose,
  onSubmit
}: CategoryModalProps) {
  // Track previous prop values to synchronize form state during render
  const [prevCategory, setPrevCategory] = useState<Category | null>(
    editingCategory
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [formData, setFormData] = useState<CategoryFormData>(() =>
    editingCategory
      ? {
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description || '',
          isFeatured: editingCategory.isFeatured,
          isPublished: editingCategory.isPublished
        }
      : DEFAULT_FORM_DATA
  );

  // Synchronize state during rendering when editingCategory or isOpen changes
  if (editingCategory !== prevCategory || isOpen !== prevIsOpen) {
    setPrevCategory(editingCategory);
    setPrevIsOpen(isOpen);
    setFormData(
      editingCategory
        ? {
            name: editingCategory.name,
            slug: editingCategory.slug,
            description: editingCategory.description || '',
            isFeatured: editingCategory.isFeatured,
            isPublished: editingCategory.isPublished
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

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl transition-all sm:p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Smart Home"
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
            />
          </div>

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
              placeholder="smart-home"
              className="mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 px-3 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Description
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
              placeholder="Brief summary of items in this category..."
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
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

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-3">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
