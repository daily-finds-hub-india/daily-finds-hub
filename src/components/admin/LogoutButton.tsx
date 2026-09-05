'use client';

import { signOut } from 'next-auth/react';
import { LogOut, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl: '/admin/login'
      });
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
      className="admin-secondary inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-70"
    >
      {isLoggingOut ? (
        <LoaderCircle size={15} strokeWidth={1.8} className="animate-spin" />
      ) : (
        <LogOut size={15} strokeWidth={1.8} />
      )}

      <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
    </button>
  );
}
