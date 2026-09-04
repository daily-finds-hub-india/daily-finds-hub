'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-12">
      <AlertTriangle className="mx-auto text-[var(--accent)]" size={28} />
      <h1 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
        Workspace unavailable
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        We could not load this admin view. Try again, and your work will remain
        unchanged.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}
