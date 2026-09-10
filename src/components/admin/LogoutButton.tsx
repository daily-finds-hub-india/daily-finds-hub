'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Loader2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean;
  callbackUrl?: string;
}

export function LogoutButton({
  collapsed = false,
  callbackUrl = '/admin/login',
  className,
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
    } catch (error) {
      console.error('[LOGOUT_ERROR]', error);
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-busy={isLoggingOut}
      title={collapsed ? 'Logout' : undefined}
      className={cn(
        'group relative flex min-h-11 w-full items-center rounded-xl overflow-hidden font-semibold text-rose-500/90 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 disabled:cursor-wait disabled:opacity-50',
        collapsed ? 'justify-center px-2' : 'gap-3 px-3',
        className
      )}
      {...props}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-rose-500/70 transition-colors duration-200 group-hover:text-rose-500">
        {isLoggingOut ? (
          <Loader2 size={18} className="animate-spin text-rose-500" />
        ) : (
          <LogOut
            size={18}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </span>

      {!collapsed && (
        <span className="truncate text-sm">
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </span>
      )}
    </button>
  );
}
