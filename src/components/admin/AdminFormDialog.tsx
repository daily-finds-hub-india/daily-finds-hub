'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface AdminFormDialogProps {
  open: boolean;
  eyebrow: string;
  title: string;
  onClose: () => void;
  closeDisabled?: boolean;
  children: ReactNode;
}

export function AdminFormDialog({
  open,
  eyebrow,
  title,
  onClose,
  closeDisabled = false,
  children
}: AdminFormDialogProps) {
  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden overscroll-none bg-black/60 backdrop-blur-sm p-3 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-5 bg-[var(--surface)]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
              {eyebrow}
            </span>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label={`Close ${title.toLowerCase()} dialog`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
