'use client';

import { useTranslations } from 'next-intl';

import GenerateButton from '@/components/RouteOptions/GenerateButton';
import type { Algorithm } from '@/components/types';
import { useMapStore } from '@/src/store/useMapStore';

export default function CityAlgorithmPicker() {
  const t = useTranslations();

  const start = useMapStore((s) => s.start);
  const setQuery = useMapStore((s) => s.setQuery);
  const geocode = useMapStore((s) => s.geocode);
  const pickResult = useMapStore((s) => s.pickResult);

  const algorithm = useMapStore((s) => s.algorithm);
  const setAlgorithm = useMapStore((s) => s.setAlgorithm);

  const getResult = useMapStore((s) => s.getResult);
  const isGenerating = useMapStore((s) => s.isGenerating);
  const generationError = useMapStore((s) => s.error);

  const canSearch = (start.query ?? '').trim().length >= 3;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* City search */}
        <div className="relative flex-1">
          <label className="mb-1 block text-sm font-semibold">{t('routeOptions_LocationPicker_start_label')}</label>
          <input
            type="search"
            value={start.query}
            onChange={(e) => setQuery('start', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSearch) geocode('start');
            }}
            placeholder="Warszawa"
            className="w-full border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 dark:bg-zinc-700"
            inputMode="search"
            aria-label="Wyszukaj miasto"
          />

          {start.error && <p className="mt-1 text-xs text-red-600">{start.error}</p>}

          {start.results.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto border divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
              {start.results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pickResult('start', r)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Algorithm */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">{t('routeOptions_AlgorithmPicker_legend')}</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 dark:bg-zinc-700"
          >
            <option value="dfs">{t('routeOptions_AlgorithmPicker_dfs_label')}</option>
            <option value="astar">{t('routeOptions_AlgorithmPicker_astar_label')}</option>
            <option value="random">{t('routeOptions_AlgorithmPicker_random_label')}</option>
            <option value="allstreet">{t('routeOptions_AlgorithmPicker_allstreet_label')}</option>
          </select>
        </div>
      </div>

      {generationError && <p className="text-xs text-red-600">{generationError}</p>}

      <GenerateButton
        label={t('routeOptions_GenerateButton_label')}
        loadingLabel={t('routeOptions_GenerateButton_LoadingLabel')}
        loading={isGenerating}
        onClick={() => getResult()}
      />
    </div>
  );
}
