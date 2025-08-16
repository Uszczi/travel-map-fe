'use client';

import { faBars, faGlobe, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import Portal from '@/components/Portal';
import ThemeToggleButton from '@/components/ThemeToggleButton';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (target: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = target; // ['', 'pl', ...] → ['', 'en', ...]
    const nextPath = segments.join('/') || `/${target}`;
    router.push(nextPath);
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  const base = useMemo(() => `/${locale}`, [locale]);
  const links = [
    { href: `${base}`, label: t('navhome') },
    { href: `${base}/mapa`, label: t('navmap') },
  ];

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/70 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <nav className="mx-auto container flex h-14 items-center justify-between mx-auto">
          {/* Logo */}
          <Link href={base} className="font-semibold tracking-tight ml-4">
            City Travel
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition hover:opacity-80 ${isActive(link.href) ? 'font-semibold' : 'opacity-80'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language switch */}
          <div className="hidden md:flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 opacity-80" aria-hidden />
              <button
                onClick={() => switchLocale('pl')}
                className={`text-sm ${locale === 'pl' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                aria-label="Polski"
              >
                PL
              </button>
              <span className="opacity-30">/</span>
              <button
                onClick={() => switchLocale('en')}
                className={`text-sm ${locale === 'en' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            <ThemeToggleButton />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(true)}
            className="rounded-md p-2 ring-offset-2 transition hover:bg-zinc-100 focus-visible:ring-2 md:hidden dark:hover:bg-zinc-900"
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[99999] md:hidden" role="dialog" aria-modal="true">
            {/* overlay (zamyka po kliknięciu) */}
            <div className="absolute inset-0 bg-black/40 z-[99998]" onClick={() => setOpen(false)} aria-hidden />

            {/* panel */}
            <div className="absolute right-0 top-0 z-[100000] h-full w-100 max-w-[85%] border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-5 w-5 mr-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-2 py-2 text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-900 ${isActive(link.href) ? 'font-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />

                {/* Language */}
                <div className="flex">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 opacity-80" />
                    <span className="text-sm">Language</span>
                  </div>
                  <div className="flex items-center gap-2 ml-5">
                    <button
                      type="button"
                      onClick={() => switchLocale('pl')}
                      className={`text-sm ${locale === 'pl' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                    >
                      PL
                    </button>
                    <span className="opacity-30">/</span>
                    <button
                      type="button"
                      onClick={() => switchLocale('en')}
                      className={`text-sm ${locale === 'en' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
