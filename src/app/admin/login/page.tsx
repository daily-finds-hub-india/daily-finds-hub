'use client';

import { FormEvent, useState } from 'react';
import { ArrowLeft, LoaderCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

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
    <main className="min-h-screen bg-[var(--background)] px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
          >
            Daily Finds Hub
          </Link>

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Private workspace
          </span>
        </div>

        <div className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_440px] lg:gap-24 lg:py-20">
          <div className="max-w-xl">
            <div className="mb-8 flex h-12 w-12 items-center justify-center border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)]">
              <ShieldCheck size={23} strokeWidth={1.6} />
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Admin access
            </p>

            <h1 className="max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--text-primary)] sm:text-6xl">
              Keep the collection moving.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-[var(--text-secondary)]">
              Sign in to manage the finds, categories, and details that shape
              Daily Finds Hub.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-8 dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Enter your credentials to continue.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                >
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full border border-[var(--border-strong)] bg-transparent px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-[var(--border-strong)] bg-transparent px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="border-l-2 border-[var(--accent)] px-3 text-sm text-[var(--accent)]"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              Back to site
            </Link>
          </form>
        </div>

        <p className="border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)]">
          Daily Finds Hub India
        </p>
      </div>
    </main>
  );
}
