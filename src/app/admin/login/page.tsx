'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  ShieldCheck,
  User
} from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AdminHeader } from '@/components/admin/AdminHeader';

function getSafeCallbackUrl(value: string | null): string {
  if (!value) {
    return '/admin';
  }

  try {
    const url = new URL(value, window.location.origin);

    const isSameOrigin = url.origin === window.location.origin;
    const isAdminPath =
      url.pathname === '/admin' || url.pathname.startsWith('/admin/');
    const isRelativePath = value.startsWith('/') && !value.startsWith('//');

    if (isSameOrigin && isAdminPath && isRelativePath) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // Fall back to the default admin destination.
  }

  return '/admin';
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setError('');
    setIsLoading(true);

    const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));

    try {
      const result = await signIn('credentials', {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl
      });

      if (!result || result.error) {
        setError('Invalid username or password.');
        setPassword('');
        return;
      }

      router.replace(callbackUrl);
    } catch {
      setError('Unable to sign in right now. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  }

  function handleUsernameChange(value: string) {
    setUsername(value);

    if (error) {
      setError('');
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);

    if (error) {
      setError('');
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <AdminHeader authenticated={false} />

      <div className="relative isolate overflow-hidden">
        {/* Decorative background detail */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden"
        >
          <div className="absolute left-[-12%] top-[-45%] h-[420px] w-[420px] rounded-full bg-[var(--accent)]/8 blur-3xl" />

          <div className="absolute right-[-10%] top-[-35%] h-[360px] w-[360px] rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>

        {/*
          Match the public Header exactly:
          default: 4.5rem
          sm+:      4.75rem
        */}
        <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-[1440px] items-center px-4 py-10 sm:min-h-[calc(100vh-4.75rem)] sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16 xl:gap-24">
            {/* Intro */}
            <section className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] text-[var(--accent)]">
                  <ShieldCheck size={19} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-text)] sm:text-xs">
                    Admin Cockpit
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)] sm:text-xs">
                    Daily Finds Hub
                  </p>
                </div>
              </div>

              <h1 className="mt-7 max-w-3xl text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-[var(--text-primary)]">
                Curate the finds.
                <br className="hidden sm:block" />
                <span className="text-[var(--accent)]">Power the catalog.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
                Manage products, affiliate links, and category collections from
                one secure workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-xs">
                    Secure session
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="hidden h-3.5 w-px bg-[var(--border-strong)] sm:block"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-xs">
                  Protected access
                </span>
              </div>

              <div className="mt-10 hidden border-t border-[var(--border)] pt-6 lg:block">
                <p className="max-w-md text-xs leading-5 text-[var(--text-muted)]">
                  This area is restricted to authorized Daily Finds Hub
                  administrators.
                </p>
              </div>
            </section>

            {/* Login Card */}
            <section className="w-full">
              <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-raised)]">
                <div className="rounded-[1.35rem] border border-[var(--border)]/70 bg-[var(--surface)] p-5 sm:p-7 lg:p-8">
                  {/* Card Header */}
                  <div className="mb-7">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-text)]">
                        <Lock size={12} strokeWidth={2.2} aria-hidden="true" />

                        <span>Secure access</span>
                      </div>

                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]"
                      />
                    </div>

                    <h2 className="text-2xl font-bold tracking-[-0.035em] text-[var(--text-primary)] sm:text-[1.75rem]">
                      Welcome back
                    </h2>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-[var(--text-secondary)] sm:text-sm sm:leading-6">
                      Sign in with your administrator credentials to continue.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                      <label
                        htmlFor="username"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] sm:text-xs"
                      >
                        Username
                      </label>

                      <div className="group relative">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)] transition-colors duration-200 group-focus-within:text-[var(--accent)]"
                        >
                          <User size={17} strokeWidth={1.8} />
                        </div>

                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          required
                          disabled={isLoading}
                          value={username}
                          onChange={(event) =>
                            handleUsernameChange(event.target.value)
                          }
                          aria-invalid={Boolean(error)}
                          className="h-[3.25rem] w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/45 pl-11 pr-3.5 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-[background-color,border-color,box-shadow] duration-200 focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15 disabled:cursor-not-allowed disabled:opacity-60"
                          placeholder="Enter admin username"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] sm:text-xs"
                      >
                        Password
                      </label>

                      <div className="group relative">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)] transition-colors duration-200 group-focus-within:text-[var(--accent)]"
                        >
                          <Lock size={17} strokeWidth={1.8} />
                        </div>

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          disabled={isLoading}
                          value={password}
                          onChange={(event) =>
                            handlePasswordChange(event.target.value)
                          }
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? 'login-error' : undefined}
                          className="h-[3.25rem] w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)]/45 pl-11 pr-12 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-[background-color,border-color,box-shadow] duration-200 focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15 disabled:cursor-not-allowed disabled:opacity-60"
                          placeholder="Enter your password"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          disabled={isLoading}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          title={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff
                              size={17}
                              strokeWidth={1.9}
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              size={17}
                              strokeWidth={1.9}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {error ? (
                      <div
                        id="login-error"
                        role="alert"
                        className="rounded-xl border border-red-500/25 bg-red-500/8 px-3.5 py-3 text-xs font-semibold leading-5 text-red-600 dark:text-red-400"
                      >
                        {error}
                      </div>
                    ) : null}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-slate-950 transition-[transform,background-color,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {isLoading ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : null}

                      <span>
                        {isLoading ? 'Signing in...' : 'Sign in to Cockpit'}
                      </span>

                      {!isLoading ? (
                        <ArrowUpRight
                          size={16}
                          strokeWidth={2}
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  </form>

                  {/* Return Link */}
                  <div className="mt-6 border-t border-[var(--border)] pt-5 text-center">
                    <Link
                      href="/"
                      className="group inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      <ArrowLeft
                        size={13}
                        strokeWidth={2}
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />

                      <span>Return to public site</span>
                    </Link>
                  </div>
                </div>
              </div>

              <p className="mt-4 px-2 text-center text-[10px] leading-4 text-[var(--text-muted)] sm:text-xs">
                Authorized administrators only.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
