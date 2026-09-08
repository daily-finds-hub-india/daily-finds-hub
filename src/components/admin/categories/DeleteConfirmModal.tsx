'use client';

import { AlertTriangle } from 'lucide-react';
import { Category } from '@/types/category';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  category,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Delete Category
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[var(--text-primary)]">
                {category.name}
              </span>
              ?
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
