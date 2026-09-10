import { useState } from 'react';
import {
  Database,
  Trash2,
  Loader2,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { runCloudinaryCleanupClient } from '@/lib/services/admin-profile.client';

interface MaintenanceTabProps {
  pendingCount: number;
  onUpdateCount: (count: number) => void;
}

export function MaintenanceTab({
  pendingCount,
  onUpdateCount
}: MaintenanceTabProps) {
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupStatus, setCleanupStatus] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  const handleRunCleanup = async () => {
    setIsCleaning(true);
    setCleanupStatus(null);
    setCleanupError(null);

    try {
      const data = await runCloudinaryCleanupClient();
      onUpdateCount(data.remainingCount);
      setCleanupStatus(data.message);
    } catch (err: unknown) {
      setCleanupError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <Database size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                Storage maintenance
              </h2>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Keep your Cloudinary storage clean by removing assets that are
                no longer in use.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/15 p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                  <Trash2 size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Orphaned image cleanup
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs leading-5 text-[var(--text-muted)]">
                    Images deleted from product or category records are placed
                    into a cleanup queue before permanent deletion.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Pending deletions
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-2xl font-bold ${pendingCount > 0 ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
                  >
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-5 text-[var(--text-muted)]">
                {pendingCount > 0
                  ? `${pendingCount} image${pendingCount === 1 ? '' : 's'} waiting for permanent deletion.`
                  : 'There are currently no images waiting for cleanup.'}
              </p>

              <button
                type="button"
                disabled={isCleaning || pendingCount === 0}
                onClick={handleRunCleanup}
                className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-bold text-[var(--surface)] transition-all hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35 sm:w-auto"
              >
                {isCleaning ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Cleaning...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} /> Run cleanup
                  </>
                )}
              </button>
            </div>
          </div>

          {(cleanupStatus || cleanupError) && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl border p-3.5 ${cleanupError ? 'border-rose-500/20 bg-rose-500/10 text-rose-500' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'}`}
            >
              {cleanupError ? (
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              )}
              <p className="text-xs font-medium leading-5">
                {cleanupError || cleanupStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
