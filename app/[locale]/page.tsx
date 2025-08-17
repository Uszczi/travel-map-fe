'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const locale = useLocale();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col items-center mt-2 md:mt-8">
        <h1 className="text-4xl font-bold text-center">City Travel</h1>
        <p>City Travel jest aplikacją ...</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/${locale}/mapa`}
          className="rounded-2xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                           bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          Otwórz mapę
        </Link>
      </div>
    </div>
  );
}
