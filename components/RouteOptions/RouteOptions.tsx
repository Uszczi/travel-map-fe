'use client';

import { faAnglesLeft, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AdditionalPicker from '@/components/RouteOptions/AdditionalPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import { useMapStore } from '@/src/store/useMapStore';

type Props = {
  onCollapse?: () => void; // wywołane po kliknięciu w guzik w nagłówku
  isCollapsed?: boolean; // true = zwinięte
};

export default function RouteOptions({ onCollapse, isCollapsed = false }: Props) {
  const t = useTranslations();

  const { start, end, preferNew, distance, algorithm } = useMapStore(
    useShallow((s) => ({
      start: s.start,
      end: s.end,
      preferNew: s.preferNew,
      distance: s.distance,
      algorithm: s.algorithm,
    })),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const generationError = useMapStore((s) => s.error);
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);
  const setPreferNew = useMapStore((s) => s.setPreferNew);
  const setDistance = useMapStore((s) => s.setDistance);
  const setAlgorithm = useMapStore((s) => s.setAlgorithm);
  const getResult = useMapStore((s) => s.getResult);

  const collapseClasses = isCollapsed
    ? '-translate-y-full sm:translate-y-0 sm:-translate-x-full'
    : 'translate-y-0 sm:translate-x-0';

  return (
    <section
      id="route-options-aside"
      aria-hidden={isCollapsed}
      className={[
        'flex flex-col gap-2',
        'transition-transform duration-300 ease-out will-change-transform',
        'transform-gpu', // płynniejsze animacje
        collapseClasses,
      ].join(' ')}
    >
      <header className="mt-2 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide">{t('routeOptions_label')}</h2>

        {/* Guzik do zwinięcia panelu */}
        <button
          type="button"
          onClick={onCollapse}
          aria-controls="route-options-aside"
          aria-expanded={!isCollapsed}
          aria-label="Zwiń panel opcji"
          className="inline-flex items-center gap-2  border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring"
        >
          {/* Ikona: na telefonie strzałki w górę, na desktopie w lewo */}
          <span className="sm:hidden inline-flex">
            <FontAwesomeIcon icon={faAnglesUp} className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline-flex">
            <FontAwesomeIcon icon={faAnglesLeft} className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Zwiń</span>
        </button>
      </header>

      <LocationPicker
        legend={t('routeOptions_LocationPicker_start_label')}
        which="start"
        point={start}
        setPoint={setStart}
        setOtherPoint={setEnd}
      />

      <LocationPicker
        legend={t('routeOptions_LocationPicker_end_label')}
        which="end"
        point={end}
        setPoint={setEnd}
        setOtherPoint={setStart}
      />

      <AlgorithmPicker legend={t('routeOptions_AlgorithmPicker_legend')} value={algorithm} onChange={setAlgorithm} />

      <DistancePicker legend={t('routeOptions_Distance_legend')} value={distance} onChange={setDistance} />

      <AdditionalPicker
        legend={t('routeOptions_AdditionalPicker_label')}
        preferNewRoads={preferNew}
        setPreferNewRoads={setPreferNew}
      />

      {generationError && <p className="text-xs text-red-600">{generationError}</p>}

      <GenerateButton
        label={t('routeOptions_GenerateButton_label')}
        loadingLabel={t('routeOptions_GenerateButton_LoadingLabel')}
        loading={isGenerating}
        onClick={async () => {
          if (isGenerating) return;
          setIsGenerating(true);
          try {
            await getResult();
          } finally {
            setIsGenerating(false);
          }
        }}
      />
    </section>
  );
}
