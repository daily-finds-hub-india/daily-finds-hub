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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-[var(--text-primary)] outline-none"
      >
        {label && (
          <span className="font-normal text-[var(--text-muted)]">{label}</span>
        )}

        <span>{selected?.label}</span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={cn(
            'text-[var(--text-muted)] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute z-30 mt-2 w-max min-w-[180px] max-w-[calc(100vw-2rem)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]',
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
                  'flex w-full items-center justify-between gap-5 whitespace-nowrap px-3 py-2 text-left text-sm',
                  'transition-colors',
                  isSelected
                    ? 'bg-[var(--surface-muted)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {option.label}

                {isSelected && (
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--accent)]"
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
