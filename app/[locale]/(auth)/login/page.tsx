'use client';

// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRightToBracket,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginFormPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, _setError] = useState();
  const [loading, _setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length >= 3 && password.length >= 6;

  const onSubmit = (_obj: unknown) => {};
  const onOAuth = (_obj: unknown) => {};

  return (
    <div className="flex justify-center items-center h-full p-3 sm:p-6">
      <section
        role="form"
        aria-busy={loading}
        className={['w-full max-w-md', 'rounded-xl border p-3 dark:bg-zinc-900 space-y-3', 'shadow-sm'].join(' ')}
      >
        <header className="space-y-0.5">
          <h2 className="text-lg font-semibold tracking-wide">Zaloguj się</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Miło Cię znowu widzieć. Wróć na mapę i generuj nowe trasy.
          </p>
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

        <div className="space-y-3">
          {/* E-mail */}
          <label htmlFor="email" className="grid gap-1">
            <span className="text-sm font-medium">E-mail</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <FontAwesomeIcon icon={faEnvelope} className="opacity-70" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.kowalski@example.com"
                className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
              />
            </div>
          </label>

          {/* Hasło */}
          <label htmlFor="password" className="grid gap-1">
            <span className="text-sm font-medium">Hasło</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <FontAwesomeIcon icon={faLock} className="opacity-70" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-10 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-800/40"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </label>

          {/* Opcje */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              Zapamiętaj mnie
            </label>
            <Link href="/pl/password-reset" className="text-sm underline-offset-4 hover:underline">
              Nie pamiętasz hasła?
            </Link>
          </div>

          {/* Submit – zachowanie jak Twoje przyciski: border, hover:border-zinc-700, active:translate-y-px */}
          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={async () => {
              if (!canSubmit || loading) return;
              await onSubmit({ email, password, remember });
            }}
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
                <span>Logowanie…</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                <span>Zaloguj się</span>
              </>
            )}
          </button>

          {/* separator */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-500">albo</span>
            </div>
          </div>

          {/* OAuth – takie same guzikowe DNA jak w LocationPicker */}
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => onOAuth?.('strava')}
              className={[
                'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
                'border transition-transform duration-100 active:translate-y-px',
                'hover:border-zinc-700',
              ].join(' ')}
            >
              {/* Ikona Stravy możesz podmienić na własną */}
              <span>Kontynuuj ze Stravą</span>
            </button>

            <button
              type="button"
              onClick={() => onOAuth?.('google')}
              className={[
                'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
                'border transition-transform duration-100 active:translate-y-px',
                'hover:border-zinc-700',
              ].join(' ')}
            >
              <span>Kontynuuj z Google</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Nie masz konta?{' '}
          <Link href="/pl/register" className="font-medium underline-offset-4 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </section>
    </div>
  );
}
