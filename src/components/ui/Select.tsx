'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label?: string;
  align?: 'left' | 'right';
}

export function Select({
  value,
  options,
  onChange,
  label,
  align = 'right'
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium',
          'bg-[var(--surface)] text-[var(--text-primary)]',
          'transition-[background-color,border-color,box-shadow] duration-200',
          'hover:bg-[var(--surface-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          open
            ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
            : 'border-[var(--border-strong)]'
        )}
      >
        {label && (
          <span className="shrink-0 font-normal text-[var(--text-muted)]">
            {label}
          </span>
        )}

        <span className="truncate">{selected?.label ?? 'Select'}</span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-[var(--text-muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label ?? 'Options'}
          className={cn(
            'absolute z-30 mt-2 min-w-[180px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[var(--border-strong)]',
            'bg-[var(--surface)] p-1.5 shadow-[var(--shadow-raised)]',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex min-h-10 w-full items-center justify-between gap-5 rounded-lg px-3 py-2 text-left text-sm',
                  'transition-colors duration-150',
                  isSelected
                    ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent-text)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                <span className="truncate">{option.label}</span>

                {isSelected && (
                  <Check
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--accent)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
