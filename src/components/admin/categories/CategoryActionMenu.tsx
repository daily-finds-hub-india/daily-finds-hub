import { Edit3, Trash2 } from 'lucide-react';

export function CategoryActionMenu({
  onEdit,
  onDelete
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Edit3 size={14} className="text-[var(--text-muted)]" />
        <span>Edit</span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-400"
      >
        <Trash2 size={14} />
        <span>Delete</span>
      </button>
    </div>
  );
}
