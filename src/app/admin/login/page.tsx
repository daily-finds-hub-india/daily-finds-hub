'use client';

import { FormEvent, useState } from 'react';
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

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError('Invalid username or password.');
      setIsLoading(false);
      return;
    }

    window.location.href = result?.url || callbackUrl;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Daily Finds Hub
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Admin login
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to manage products and categories.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
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
                className="w-full border border-[var(--border-strong)] bg-transparent px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
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
                className="w-full border border-[var(--border-strong)] bg-transparent px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-[var(--accent)]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
