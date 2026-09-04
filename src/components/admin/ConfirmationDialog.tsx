'use client';

import { AlertTriangle, LoaderCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-5"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
            <AlertTriangle size={20} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="confirmation-title"
          className="mt-5 text-lg font-semibold text-[var(--text-primary)]"
        >
          {title}
        </h2>
        <p
          id="confirmation-description"
          className="mt-2 text-sm leading-6 text-[var(--text-secondary)]"
        >
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : null}
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
