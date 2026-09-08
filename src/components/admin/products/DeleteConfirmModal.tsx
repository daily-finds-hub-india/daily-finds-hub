'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Product } from '@/types/product';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  product,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl transition-all sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={20} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Delete Product
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {product.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
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
            className="h-9 rounded-xl bg-rose-500 px-4 text-xs font-bold text-white shadow-sm hover:bg-rose-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
