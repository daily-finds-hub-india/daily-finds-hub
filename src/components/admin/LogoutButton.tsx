'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  async function handleLogout() {
    await signOut({
      callbackUrl: '/admin/login'
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-8 border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      Sign out
    </button>
  );
}
