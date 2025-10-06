'use client';

import { faEnvelope, faPaperPlane, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';

import { authService } from '@/src/services/auth';

export default function ResetRequestPage() {
  const t = useTranslations('auth.resetRequest');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSubmit = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setLoading(true);
      setError(null);
      try {
        await authService.passwordReset({ email });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
        setError(msg);
      } finally {
        setSent(true);
        setLoading(false);
      }
    },
    [email, canSubmit],
  );

  return (
    <main className="min-h-dvh grid place-items-center p-3 sm:p-6">
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

          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-2 text-sm text-emerald-800 dark:text-emerald-200"
            >
              {t('successGeneric')}
            </div>
          ) : (
            <form onSubmit={onSubmit} aria-busy={loading} className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">{t('emailLabel')}</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FontAwesomeIcon icon={faEnvelope} className="opacity-70" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                    required
                  />
                </div>
              </label>

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
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>{loading ? t('loadingLabel') : t('submitLabel')}</span>
              </button>
            </form>
          )}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t('backToLoginPrefix')}{' '}
            <Link href="/pl/login" className="font-medium underline-offset-4 hover:underline">
              {t('backToLogin')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
