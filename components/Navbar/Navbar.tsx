'use client';

import { faBars, faGlobe, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import ThemeToggleButton from '@/components/Navbar/ThemeToggleButton';
import Portal from '@/components/Portal';

export default function Navbar() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (target: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = target; // ['', 'pl', ...] → ['', 'en', ...]
    const nextPath = segments.join('/');
    router.push(nextPath);
  };

  const base = useMemo(() => `/${locale}`, [locale]);
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === base) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  // Preserved for future active-state styling
  void isActive;
  const links = [
    { href: `${base}`, label: t('home.title') },
    { href: `${base}/mapa`, label: t('map.title') },
  ];
  void links;

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div>
      <header
        className="sticky top-2 z-40 backdrop-blur m-2
             "
      >
        <nav className="mx-auto container flex h-20 items-center justify-between px-5">
          {/* Logo */}
          <Link href={base} className="font-bold tracking-tight text-xl">
            {t('brand')}
          </Link>

          {/* Language */}
          <div className="hidden md:flex items-center gap-4">
            <div
              className="flex items-center gap-2 select-none mr-4"
              role="group"
              aria-label={t('languageGroupAriaLabel')}
            >
              <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 opacity-80 pointer-events-none" aria-hidden />

              <button
                type="button"
                onClick={() => switchLocale('pl')}
                aria-label={t('langAriaLabel.pl')}
                className={`
                  relative text-sm cursor-pointer px-3 py-2  transition
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-zinc-500/40 dark:focus-visible:outline-zinc-400/30

                  hover:bg-zinc-100 hover:text-zinc-900
                  dark:hover:bg-zinc-800/80 dark:hover:text-white

                  after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0
                  after:h-0.5 after:rounded-full after:bg-current after:scale-x-0
                  hover:after:scale-x-100 after:origin-left after:transition

                  ${locale === 'pl' ? 'font-semibold bg-zinc-100 dark:bg-zinc-800 dark:text-white' : 'opacity-70 hover:opacity-100'}
                `}
              >
                {t('langLabel.pl')}
              </button>

              <span className="opacity-30 pointer-events-none">/</span>

              <button
                type="button"
                onClick={() => switchLocale('en')}
                aria-label={t('langAriaLabel.en')}
                className={`
                  relative text-sm cursor-pointer px-2 py-1  transition
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-zinc-500/40 dark:focus-visible:outline-zinc-400/30

                  hover:bg-zinc-100 hover:text-zinc-900
                  dark:hover:bg-zinc-800/80 dark:hover:text-white

                  after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0
                  after:h-0.5 after:rounded-full after:bg-current after:scale-x-0
                  hover:after:scale-x-100 after:origin-left after:transition

                  ${locale === 'en' ? 'font-semibold bg-zinc-100 dark:bg-zinc-800 dark:text-white' : 'opacity-70 hover:opacity-100'}
                `}
              >
                {t('langLabel.en')}
              </button>
            </div>

            <ThemeToggleButton />

            <a
              href="https://github.com/Uszczi/travel-map-fe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 ring-offset-2 transition hover:bg-zinc-100 focus-visible:ring-2 dark:hover:bg-zinc-900"
            >
              <div className="w-8 h-8 dark:bg-white  rounded-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
                </svg>
              </div>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(true)}
            className=" p-2 ring-offset-2 transition hover:bg-zinc-100 focus-visible:ring-2 md:hidden dark:hover:bg-zinc-900"
            aria-label={t('mobile.openMenu')}
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[99999] md:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40 z-[99998]" onClick={() => setOpen(false)} aria-hidden />

            <div className="fixed inset-y-0 right-0 z-[100000] h-full w-full max-w-[85%] border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
                  aria-label={t('mobile.closeMenu')}
                >
                  <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 opacity-80" />
                    <span className="text-sm">{t('language')}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-8">
                    <button
                      type="button"
                      onClick={() => switchLocale('pl')}
                      aria-label={t('langAriaLabel.pl')}
                      className={`text-sm ${locale === 'pl' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                    >
                      {t('langLabel.pl')}
                    </button>
                    <span className="opacity-30">/</span>
                    <button
                      type="button"
                      onClick={() => switchLocale('en')}
                      aria-label={t('langAriaLabel.en')}
                      className={`text-sm ${locale === 'en' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                    >
                      {t('langLabel.en')}
                    </button>
                  </div>
                </div>
                <ThemeToggleButton />
                <div>
                  <a
                    href="https://github.com/Uszczi/travel-map-fe"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <div className="w-8 h-8 dark:bg-white  rounded-3xl">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
