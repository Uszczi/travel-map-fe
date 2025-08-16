'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faXmark,
  faSun,
  faMoon,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)

  // Zmiana locale z zachowaniem aktualnej ścieżki
  const switchLocale = (target: string) => {
    if (!pathname) return
    const segments = pathname.split('/')
    segments[1] = target // ['', 'pl', ...] → ['', 'en', ...]
    const nextPath = segments.join('/') || `/${target}`
    router.push(nextPath)
  }

  // Czy link jest aktywny?
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`)

  // Linki nawigacji
  const base = useMemo(() => `/${locale}`, [locale])
  const links = [
    { href: `${base}`, label: t('navhome') },
    { href: `${base}/mapa`, label: t('navmap') },
  ]

  // Blokuj scroll, gdy mobile menu otwarte
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/70 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <nav className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href={base} className="font-semibold tracking-tight">MyApp</Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:opacity-80 ${isActive(link.href) ? 'font-semibold' : 'opacity-80'}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Language switch */}
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

          {/* Theme switch */}
          <button
            onClick={() => setTheme((resolvedTheme === 'dark') ? 'light' : 'dark')}
            className="rounded-md p-2 ring-offset-2 transition hover:bg-zinc-100 focus-visible:ring-2 dark:hover:bg-zinc-900"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={resolvedTheme === 'dark' ? 'Jasny' : 'Ciemny'}
          >
            {resolvedTheme === 'dark'
              ? <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
              : <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
            }
          </button>
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

      {/* Mobile sheet */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="ml-auto h-full w-80 max-w-[85%] border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {links.map(link => (
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
              <div className="flex items-center justify-between rounded-md px-2 py-2">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 opacity-80" />
                  <span className="text-sm">Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchLocale('pl')}
                    className={`text-sm ${locale === 'pl' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                  >PL</button>
                  <span className="opacity-30">/</span>
                  <button
                    onClick={() => switchLocale('en')}
                    className={`text-sm ${locale === 'en' ? 'font-semibold' : 'opacity-70'} hover:opacity-100`}
                  >EN</button>
                </div>
              </div>

              {/* Theme */}
              <button
                onClick={() => setTheme((resolvedTheme === 'dark') ? 'light' : 'dark')}
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <span className="text-sm">{resolvedTheme === 'dark' ? 'Jasny' : 'Ciemny'}</span>
                {resolvedTheme === 'dark'
                  ? <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
                  : <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
