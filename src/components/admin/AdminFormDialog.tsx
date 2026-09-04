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
    <div className="fixed inset-0 z-[100] flex h-screen w-screen items-start justify-center overflow-hidden overscroll-none bg-black/60 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        className="my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:my-8 sm:max-h-[calc(100vh-4rem)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label={`Close ${title.toLowerCase()} dialog`}
            className="flex h-9 w-9 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
