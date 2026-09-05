'use client';

import { FormEvent, useState } from 'react';
import { ArrowLeft, LoaderCircle, ShieldCheck, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { BrandMark } from '@/components/layout/BrandMark';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError('Invalid username or password.');
        return;
      }

      window.location.href = result?.url || callbackUrl;
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-6 sm:px-8 sm:py-8 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="mx-auto w-full max-w-6xl flex items-center justify-between border-b border-[var(--border)] pb-5">
        <BrandMark compact />

        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          <ShieldCheck size={14} className="text-[var(--accent)]" />
          <span>Staff Portal</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto w-full max-w-6xl py-12 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_420px] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              <Lock size={12} strokeWidth={2.4} />
              <span>Admin Cockpit</span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Curate the finds. Power the catalog.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
              Manage live products, affiliate links, tags, and category collections for Daily Finds Hub India.
            </p>

            <div className="mt-8 flex items-center gap-4 text-xs font-semibold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure session
              </span>
              <span>•</span>
              <span>Encrypted credentials</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl">
            <div className="mb-7">
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Welcome back
              </h2>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                Enter your administrative credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
                    <User size={16} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/50 pl-10 pr-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    placeholder="Enter admin username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)]">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/50 pl-10 pr-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-500 dark:text-red-400"
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-[var(--accent-hover)] hover:shadow-md hover:shadow-amber-500/20 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in to Cockpit'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
              >
                <ArrowLeft size={13} strokeWidth={2} />
                Return to public storefront
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-6xl border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)] flex items-center justify-between">
        <span>Daily Finds Hub India • Administrative Portal</span>
        <span>Version 2.0</span>
      </div>
    </main>
  );
}
