'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

import { IconButton } from '@/components/ui/IconButton';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'daily-finds-theme';

function getTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener('storage', callback);
  };
}

function getServerTheme(): Theme {
  return 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');

    localStorage.setItem(STORAGE_KEY, nextTheme);

    window.dispatchEvent(new Event('storage'));
  }

  const isDark = theme === 'dark';

  return (
    <IconButton
      label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.8} />
      ) : (
        <Moon size={18} strokeWidth={1.8} />
      )}
    </IconButton>
  );
}
