'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Category } from '@/types/category';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  category: Category | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  category,
  isLoading = false,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={isLoading ? undefined : onClose}
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
            disabled={isLoading}
            onClick={onClose}
            className="h-9 rounded-xl border border-[var(--border)] px-4 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
