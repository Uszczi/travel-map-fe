'use client';

// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRightToBracket,
  faCheck,
  faEnvelope,
  faLock,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const pwChecks = useMemo(() => {
    const checks = {
      len: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      num: /[0-9]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  }, [password]);

  const canSubmit = useMemo(() => {
    return email.length > 3 && pwChecks.score >= 3 && confirm === password && accept;
  }, [email, pwChecks.score, confirm, password, accept]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!apiBase) {
        setError('Brak NEXT_PUBLIC_API_URL. Ustaw zmienną środowiskową.');
        return;
      }
      if (!canSubmit) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const r = await fetch(`${apiBase}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        if (!r.ok) {
          const msg = (await r.text().catch(() => '')) || `HTTP ${r.status}`;
          throw new Error(msg);
        }

        setSuccess('Konto utworzone. Sprawdź pocztę, aby potwierdzić adres e-mail.');
        // window.location.href = "/";
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Nieznany błąd';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [apiBase, canSubmit, email, password],
  );

  const onOAuth = useCallback(
    (provider: 'strava' | 'google') => {
      if (!apiBase) {
        setError('Brak NEXT_PUBLIC_API_URL. Ustaw zmienną środowiskową.');
        return;
      }
      const path = provider === 'google' ? '/auth/google' : '/auth/strava';
      window.location.href = `${apiBase}${path}`;
    },
    [apiBase],
  );

  return (
    <main className="h-full grid place-items-center p-3 sm:p-6">
      <section className="w-full max-w-md">
        {/* Ten sam DNA co LocationPicker/RouteOptions */}
        <div className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <header className="space-y-0.5">
            <h2 className="text-lg font-semibold tracking-wide">Załóż konto</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Dołącz i odkrywaj nowe trasy z travel‑map.</p>
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

          {success && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-2 text-sm text-emerald-800 dark:text-emerald-200"
            >
              <FontAwesomeIcon icon={faCheck} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={onSubmit} aria-busy={loading} className="grid gap-3">
            {/* E‑mail */}
            <label className="grid gap-1">
              <span className="text-sm font-medium">E-mail</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faEnvelope} className="opacity-70" />
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan.kowalski@example.com"
                  className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                />
              </div>
            </label>

            {/* Hasło + siła */}
            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Hasło</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FontAwesomeIcon icon={faLock} className="opacity-70" />
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  />
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        'h-1 rounded-full ' + (pwChecks.score > i ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700')
                      }
                    />
                  ))}
                  <span className="col-span-4 mt-1 text-xs text-zinc-500">
                    Min. 8 znaków, litera duża/mała i cyfra.
                  </span>
                </div>
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Powtórz hasło</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FontAwesomeIcon icon={faLock} className="opacity-70" />
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  />
                </div>
                {confirm.length > 0 && confirm !== password && (
                  <span className="text-xs text-red-600 dark:text-red-300">Hasła nie są identyczne.</span>
                )}
              </label>
            </div>

            {/* Regulaminy */}
            <label className="inline-flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                className="mt-1 size-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              <span>
                Akceptuję{' '}
                <Link href="/terms" className="underline underline-offset-4">
                  Regulamin
                </Link>{' '}
                oraz{' '}
                <Link href="/privacy" className="underline underline-offset-4">
                  Politykę Prywatności
                </Link>
                .
              </span>
            </label>

            {/* Submit – border button jak w Twoim UI */}
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
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Zakładanie konta…</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                  <span>Utwórz konto</span>
                </>
              )}
            </button>

            {/* Separator */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-500">albo</span>
              </div>
            </div>

            {/* OAuth */}
            <div className="grid sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOAuth('strava')}
                className={[
                  'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
                  'border transition-transform duration-100 active:translate-y-px',
                  'hover:border-zinc-700',
                ].join(' ')}
              >
                <span>Kontynuuj ze Stravą</span>
              </button>
              <button
                type="button"
                onClick={() => onOAuth('google')}
                className={[
                  'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
                  'border transition-transform duration-100 active:translate-y-px',
                  'hover:border-zinc-700',
                ].join(' ')}
              >
                <span>Kontynuuj z Google</span>
              </button>
            </div>
          </form>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Masz już konto?{' '}
            <Link href="/pl/login" className="font-medium underline-offset-4 hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
