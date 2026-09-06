'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

import { IconButton } from '@/components/ui/IconButton';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'daily-finds-theme';
const THEME_EVENT = 'daily-finds-theme-change';

function getTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      callback();
    }
  }

  function handleThemeChange() {
    callback();
  }

  window.addEventListener('storage', handleStorage);
  window.addEventListener(THEME_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(THEME_EVENT, handleThemeChange);
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

    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const isDark = theme === 'dark';

  return (
    <IconButton
      label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.8} aria-hidden="true" />
      )}
    </IconButton>
  );
}
