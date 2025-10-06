'use client';

import { faCheck, faEye, faEyeSlash, faLock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';

export default function ResetWithTokenPage() {
  const t = useTranslations('auth.resetConfirm');
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const token = '';
  const locale = 'pl';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const score = useMemo(() => {
    const checks = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password)];
    return checks.filter(Boolean).length;
  }, [password]);

  const canSubmit = useMemo(() => password.length >= 8 && password === confirm, [password, confirm]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!apiBase) {
        setError('Brak NEXT_PUBLIC_API_URL');
        return;
      }
      if (!canSubmit) return;

      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`${apiBase}/auth/password/reset-confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token: token, password }),
        });
        if (!r.ok) {
          const msg = (await r.text().catch(() => '')) || `HTTP ${r.status}`;
          throw new Error(msg);
        }
        setDone(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [apiBase, token, password, canSubmit],
  );

  return (
    <main className="h-full grid place-items-center p-3 sm:p-6">
      <section className="w-full max-w-md">
        <div className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <header className="space-y-0.5">
            <h1 className="text-lg font-semibold tracking-wide">{t('title')}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('intro')}</p>
          </header>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-2 rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-2 text-sm text-red-800 dark:text-red-200"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {done ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-2 text-sm text-emerald-800 dark:text-emerald-200"
            >
              <FontAwesomeIcon icon={faCheck} className="mt-0.5 shrink-0" />
              <span>{t('success')}</span>
            </div>
          ) : (
            <form onSubmit={onSubmit} aria-busy={loading} className="grid gap-3">
              {/* Hasło */}
              <label className="grid gap-1">
                <span className="text-sm font-medium">{t('passwordLabel')}</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FontAwesomeIcon icon={faLock} className="opacity-70" />
                  </span>
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-10 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                    required
                  />
                  <button
                    type="button"
                    aria-label={show ? t('hidePassword') : t('showPassword')}
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-800/40"
                  >
                    <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                  </button>
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={'h-1 rounded-full ' + (score > i ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700')}
                    />
                  ))}
                  <span className="col-span-4 mt-1 text-xs text-zinc-500">{t('passwordHint')}</span>
                </div>
              </label>

              {/* Potwierdzenie hasła */}
              <label className="grid gap-1">
                <span className="text-sm font-medium">{t('confirmLabel')}</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FontAwesomeIcon icon={faLock} className="opacity-70" />
                  </span>
                  <input
                    type={show ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                    required
                  />
                </div>
                {confirm.length > 0 && confirm !== password && (
                  <span className="text-xs text-red-600 dark:text-red-300">{t('mismatch')}</span>
                )}
              </label>

              {/* Submit – border button jak w reszcie UI */}
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={[
                  'relative group inline-flex w-full items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
                  'border transition-transform duration-100 active:translate-y-px',
                  'hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed',
                  'shadow-sm',
                ].join(' ')}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>{t('submitLabel')}</span>
              </button>
            </form>
          )}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t('backToLoginPrefix')}{' '}
            <Link href={`/${locale}/login`} className="font-medium underline-offset-4 hover:underline">
              {t('backToLogin')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
