'use client';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`flex items-center gap-x-2 rounded-md px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer`}
      aria-label="Przełącz motyw"
    >
      <span className="text-sm min-w-[6ch]" suppressHydrationWarning>
        {resolvedTheme === 'dark' ? t('bright_theme') : t('dark_theme')}
      </span>

      <FontAwesomeIcon icon={resolvedTheme === 'dark' ? faSun : faMoon} className="h-4 w-4" />
    </button>
  );
}
