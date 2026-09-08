'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LoaderCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  callbackUrl?: string;
}

export function LogoutButton({
  className,
  callbackUrl = '/admin/login',
  onClick,
  ...props
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(event);
    }

    setIsLoggingOut(true);

    try {
      await signOut({ callbackUrl });
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-busy={isLoggingOut}
      className={cn(
        'group flex min-h-12 w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-wait disabled:opacity-70 dark:text-red-400',
        className
      )}
      {...props}
    >
      {isLoggingOut ? (
        <LoaderCircle
          size={18}
          strokeWidth={1.8}
          className="shrink-0 animate-spin"
        />
      ) : (
        <LogOut
          size={18}
          strokeWidth={1.8}
          className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
      )}

      <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
    </button>
  );
}
