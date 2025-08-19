'use client';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useMapOptions } from '@/src/store/useMapOptions';
import type { SearchState } from '@/src/store/useMapOptions';

type Props = {
  className?: string;
  legend: string;
  which: 'start' | 'end';
  point: {
    method: 'search' | 'pin';
    query: string;
    coords?: { lat: number; lng: number };
    awaitingClick: boolean;
  };
  setPoint: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
};

export default function LocationPicker({ className, legend, which, point, setPoint }: Props) {
  const search = useMapOptions((s) => s[which]);
  const setQuery = useMapOptions((s) => s.setQuery);
  const geocode = useMapOptions((s) => s.geocode);
  const pickResult = useMapOptions((s) => s.pickResult);

  const canSearch = (search.query ?? '').trim().length >= 3;

  const handlePickOnMap = () => {
    if (point.method !== 'pin') setPoint('method', 'pin');
    if (!point.awaitingClick) setPoint('awaitingClick', true);
  };

  return (
    <div
      role="group"
      aria-label={legend}
      className={`w-full rounded-xl border p-3 dark:bg-zinc-900 space-y-3 ${className ?? ''}`}
    >
      <div className="text-sm font-semibold">{legend}</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {/* input + ikona czyszczenia wewnątrz */}
          <div className="relative flex-1">
            <input
              type="search"
              value={search.query}
              onChange={(e) => setQuery(which, e.target.value)}
              onFocus={() => setPoint('method', 'search')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSearch) geocode(which);
              }}
              placeholder="np. Plac Zamkowy, Warszawa"
              className="w-full rounded-lg border dark:bg-zinc-700 px-3 py-2 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
              inputMode="search"
              aria-label="Wyszukaj miejsce"
            />

            {search.query && (
              <button
                type="button"
                onClick={() => setQuery(which, '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                aria-label="Wyczyść"
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={!canSearch || search.loading}
            onClick={() => geocode(which)}
            className={[
              'relative group inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl min-w-14',
              'border transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
              !canSearch || search.loading ? 'opacity-60 cursor-not-allowed' : '',
            ].join(' ')}
            title="Wyszukaj"
          >
            {search.loading ? 'Szukam…' : 'Szukaj'}
          </button>
        </div>

        {search.error && <p className="text-xs text-red-600">{search.error}</p>}

        {search.results.length > 0 && (
          <ul className="max-h-56 overflow-auto rounded-xl border divide-y divide-zinc-800">
            {search.results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => pickResult(which, r)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePickOnMap}
            aria-pressed={point.method === 'pin' && point.awaitingClick}
            className={[
              'relative group inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl',
              'border transition-transform duration-100 hover:border-zinc-700 active:translate-y-px',
              point.method === 'pin' && point.awaitingClick
                ? 'border-indigo-500 ring-1 ring-inset ring-indigo-500 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900'
                : '',
            ].join(' ')}
          >
            Wybierz na mapie
          </button>

          {point.coords && (
            <span className="text-sm">
              Wybrane: {point.coords.lat.toFixed(5)}, {point.coords.lng.toFixed(5)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
