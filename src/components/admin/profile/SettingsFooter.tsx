import { Loader2, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SettingsFooterProps {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  disabled: boolean;
}

export function SettingsFooter({
  isLoading,
  error,
  success,
  disabled
}: SettingsFooterProps) {
  return (
    <>
      {(error || success) && (
        <div className="border-t border-[var(--border)] px-5 py-4 sm:px-7">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium leading-5 text-rose-500">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!error && success && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium leading-5 text-emerald-500">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--surface-muted)]/10 p-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
        <button
          type="submit"
          disabled={isLoading || disabled}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-bold text-slate-950 shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save changes
            </>
          )}
        </button>
      </div>
    </>
  );
}
