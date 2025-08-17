'use client';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useMapOptions } from '@/src/store/useMapOptions';

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
  setPoint: <K extends keyof Props['point']>(key: K, value: Props['point'][K]) => void;
};

export default function PointPickerSection({ className, legend, which, point, setPoint }: Props) {
  const search = useMapOptions((s) => s.search[which]);
  const setQuery = useMapOptions((s) => s.setQuery);
  const geocode = useMapOptions((s) => s.geocode);
  const pickResult = useMapOptions((s) => s.pickResult);

  const canSearch = (search.query ?? '').trim().length >= 3;

  const handlePickOnMap = () => {
    if (point.method !== 'pin') setPoint('method', 'pin');
    if (!point.awaitingClick) setPoint('awaitingClick', true);
  };

  return (
    <fieldset className={`space-y-3 mb-5 ${className ?? ''}`}>
      <legend className="text-sm font-medium">{legend}</legend>
      {/* Sekcja wyszukiwania – tylko gdy method === 'search' */}
      {point.method === 'search' && (
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
                className="w-full rounded-md border px-3 py-2 text-sm pr-8"
                inputMode="search"
                aria-label="Wyszukaj miejsce"
              />
              {search.query && (
                <button
                  type="button"
                  onClick={() => setQuery(which, '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                'rounded-md border px-3 py-2 text-sm transition',
                !canSearch || search.loading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900',
              ].join(' ')}
              title="Wyszukaj"
            >
              {search.loading ? 'Szukam…' : 'Szukaj'}
            </button>
          </div>

          {search.error && <p className="text-xs text-red-600">{search.error}</p>}

          {search.results.length > 0 && (
            <ul className="max-h-56 overflow-auto rounded-md border divide-y">
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
      )}{' '}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePickOnMap}
            className={[
              'rounded-md px-3 py-2 text-sm border transition',
              point.method === 'pin' && point.awaitingClick
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-900',
            ].join(' ')}
          >
            Wybierz na mapie
          </button>

          {point.coords && (
            <span>
              Wybrane: {point.coords.lat.toFixed(5)}, {point.coords.lng.toFixed(5)}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
}
