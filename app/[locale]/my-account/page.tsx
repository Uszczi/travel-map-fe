'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faExclamationTriangle,
  faLink,
  faLinkSlash,
  faPen,
  faSpinner,
  faTrash,
  faUser,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';


type Connections = {
  google: boolean;
  strava: boolean;
};

type Profile = {
  id: string;
  name: string;
  email: string;
};

export default function AccountPage() {
  const t = useTranslations('account');
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<Connections>({ google: false, strava: false });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // local state for forms
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const [unlinking, setUnlinking] = useState<'google' | 'strava' | null>(null);

  const [dangerArmed, setDangerArmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pwScore = useMemo(() => {
    const checks = [newPw.length >= 8, /[A-Z]/.test(newPw), /[a-z]/.test(newPw), /\d/.test(newPw)];
    return checks.filter(Boolean).length;
  }, [newPw]);

  const canSaveProfile = useMemo(() => name.trim().length >= 2 && !!profile && name.trim() !== profile.name.trim(), [name, profile]);
  const canSavePw = useMemo(() => newPw.length >= 8 && newPw === confirmPw && currentPw.length > 0, [newPw, confirmPw, currentPw]);

  // Load profile + connections
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!apiBase) return;
      try {
        setLoadingProfile(true);
        const [meRes, conRes] = await Promise.all([
          fetch(`${apiBase}/me`, { credentials: 'include' }),
          fetch(`${apiBase}/auth/connections`, { credentials: 'include' }),
        ]);
        if (!ignore) {
          if (meRes.ok) {
            const me = await meRes.json();
            setProfile(me);
            setName(me?.name ?? '');
          }
          if (conRes.ok) {
            const con = await conRes.json();
            setConnections({ google: !!con.google, strava: !!con.strava });
          }
        }
      } catch (err: unknown) {
        if (!ignore) setBanner({ type: 'error', msg: prettifyErr(err, t('errors.generic')) });
      } finally {
        if (!ignore) setLoadingProfile(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [apiBase, t]);

  const saveProfile = useCallback(async () => {
    if (!apiBase || !profile) return;
    setSavingProfile(true);
    setBanner(null);
    try {
      const r = await fetch(`${apiBase}/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!r.ok) throw new Error((await r.text().catch(() => '')) || `HTTP ${r.status}`);
      setProfile((p) => (p ? { ...p, name: name.trim() } : p));
      setBanner({ type: 'success', msg: t('profile.saved') });
    } catch (err: unknown) {
      setBanner({ type: 'error', msg: prettifyErr(err, t('errors.generic')) });
    } finally {
      setSavingProfile(false);
    }
  }, [apiBase, name, profile, t]);

  const savePassword = useCallback(async () => {
    if (!apiBase) return;
    setSavingPw(true);
    setBanner(null);
    try {
      const r = await fetch(`${apiBase}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current: currentPw, next: newPw }),
      });
      if (!r.ok) throw new Error((await r.text().catch(() => '')) || `HTTP ${r.status}`);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setBanner({ type: 'success', msg: t('security.passwordChanged') });
    } catch (err: unknown) {
      setBanner({ type: 'error', msg: prettifyErr(err, t('errors.generic')) });
    } finally {
      setSavingPw(false);
    }
  }, [apiBase, currentPw, newPw, t]);

  const linkProvider = useCallback(
    (provider: 'google' | 'strava') => {
      if (!apiBase) return;
      const path = provider === 'google' ? '/auth/google/link' : '/auth/strava/link';
      window.location.href = `${apiBase}${path}`;
    },
    [apiBase],
  );

  const unlinkProvider = useCallback(
    async (provider: 'google' | 'strava') => {
      if (!apiBase) return;
      setUnlinking(provider);
      setBanner(null);
      try {
        const path = provider === 'google' ? '/auth/google/unlink' : '/auth/strava/unlink';
        const r = await fetch(`${apiBase}${path}`, { method: 'POST', credentials: 'include' });
        if (!r.ok) throw new Error((await r.text().catch(() => '')) || `HTTP ${r.status}`);
        setConnections((c) => ({ ...c, [provider]: false }));
        setBanner({ type: 'success', msg: t('connections.unlinked', { provider }) });
      } catch (err: unknown) {
        setBanner({ type: 'error', msg: prettifyErr(err, t('errors.generic')) });
      } finally {
        setUnlinking(null);
      }
    },
    [apiBase, t],
  );

  const deleteAccount = useCallback(async () => {
    if (!apiBase) return;
    setDeleting(true);
    setBanner(null);
    try {
      const r = await fetch(`${apiBase}/me`, { method: 'DELETE', credentials: 'include' });
      if (!r.ok) throw new Error((await r.text().catch(() => '')) || `HTTP ${r.status}`);
      // Po usunięciu konta — przekierowanie na stronę startową
      window.location.href = '/';
    } catch (err: unknown) {
      setBanner({ type: 'error', msg: prettifyErr(err, t('errors.generic')) });
    } finally {
      setDeleting(false);
    }
  }, [apiBase, t]);

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">{t('title')}</h1>
        </header>

        {banner && (
          <div
            role={banner.type === 'error' ? 'alert' : 'status'}
            aria-live={banner.type === 'error' ? 'assertive' : 'polite'}
            className={[
              'rounded-lg border p-2 text-sm',
              banner.type === 'error'
                ? 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'
                : 'border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200',
            ].join(' ')}
          >
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={banner.type === 'error' ? faExclamationTriangle : faCheck} className="mt-0.5 shrink-0" />
              <span>{banner.msg}</span>
            </div>
          </div>
        )}

        {/* General info */}
        <section className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t('profile.section')}</h2>
            {loadingProfile && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">{t('profile.name')}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faUser} className="opacity-70" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('profile.namePlaceholder')}
                  className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">{t('profile.email')}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faEnvelope} className="opacity-70" />
                </span>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  disabled
                  className="w-full rounded-lg border dark:bg-zinc-800 pl-10 pr-3 py-2 text-sm opacity-80"
                />
              </div>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveProfile}
              disabled={!canSaveProfile || savingProfile}
              className={[
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm',
                'hover:border-zinc-700 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {savingProfile && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              <FontAwesomeIcon icon={faPen} />
              <span>{t('profile.save')}</span>
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold">{t('security.section')}</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">{t('security.current')}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faLock} className="opacity-70" />
                </span>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  autoComplete="current-password"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">{t('security.new')}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faLock} className="opacity-70" />
                </span>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  autoComplete="new-password"
                />
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={'h-1 rounded-full ' + (pwScore > i ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700')} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-zinc-500">{t('security.hint')}</p>
              </div>
            </label>

            <label className="grid gap-1 sm:col-span-2">
              <span className="text-sm font-medium">{t('security.confirm')}</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <FontAwesomeIcon icon={faLock} className="opacity-70" />
                </span>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full rounded-lg border dark:bg-zinc-700 pl-10 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
                  autoComplete="new-password"
                />
              </div>
              {confirmPw.length > 0 && confirmPw !== newPw && (
                <span className="text-xs text-red-600 dark:text-red-300">{t('security.mismatch')}</span>
              )}
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={savePassword}
              disabled={!canSavePw || savingPw}
              className={[
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm',
                'hover:border-zinc-700 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {savingPw && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              <FontAwesomeIcon icon={faCheck} />
              <span>{t('security.save')}</span>
            </button>
          </div>
        </section>

        {/* Connected accounts */}
        <section className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold">{t('connections.section')}</h2>

          <ul className="grid gap-2 sm:grid-cols-2">
            {/* Google */}
            <li className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Google</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {connections.google ? t('connections.connected') : t('connections.disconnected')}
                  </div>
                </div>
                <div className="flex gap-2">
                  {connections.google ? (
                    <button
                      type="button"
                      disabled={unlinking === 'google'}
                      onClick={() => unlinkProvider('google')}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm hover:border-zinc-700 active:translate-y-px"
                    >
                      {unlinking === 'google' ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faLinkSlash} />}
                      <span>{t('connections.unlink')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => linkProvider('google')}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm hover:border-zinc-700 active:translate-y-px"
                    >
                      <FontAwesomeIcon icon={faLink} />
                      <span>{t('connections.link')}</span>
                    </button>
                  )}
                </div>
              </div>
            </li>

            {/* Strava */}
            <li className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Strava</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {connections.strava ? t('connections.connected') : t('connections.disconnected')}
                  </div>
                </div>
                <div className="flex gap-2">
                  {connections.strava ? (
                    <button
                      type="button"
                      disabled={unlinking === 'strava'}
                      onClick={() => unlinkProvider('strava')}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm hover:border-zinc-700 active:translate-y-px"
                    >
                      {unlinking === 'strava' ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faLinkSlash} />}
                      <span>{t('connections.unlink')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => linkProvider('strava')}
                      className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm hover:border-zinc-700 active:translate-y-px"
                    >
                      <FontAwesomeIcon icon={faLink} />
                      <span>{t('connections.link')}</span>
                    </button>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border p-3 dark:bg-zinc-900 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold">{t('danger.section')}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('danger.description')}</p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDangerArmed((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm hover:border-zinc-700 active:translate-y-px"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>{dangerArmed ? t('danger.cancel') : t('danger.arm')}</span>
            </button>

            <button
              type="button"
              disabled={!dangerArmed || deleting}
              onClick={deleteAccount}
              className={[
                'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm',
                'hover:border-zinc-700 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {deleting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              <span>{t('danger.delete')}</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function prettifyErr(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return fallback;
  }
}
