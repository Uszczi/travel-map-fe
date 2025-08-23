'use client';

import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';

import AdditionalPicker from '@/components/RouteOptions/AdditionalPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import { useMapStore } from '@/src/store/useMapStore';

export default function RouteOptions() {
  const t = useTranslations();

  const { start, end, preferNew, distance, algorithm, loading } = useMapStore(
    useShallow((s) => ({
      start: s.start,
      end: s.end,
      preferNew: s.preferNew,
      distance: s.distance,
      algorithm: s.algorithm,
      loading: s.loading,
    })),
  );
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);
  const setPreferNew = useMapStore((s) => s.setPreferNew);
  const setDistance = useMapStore((s) => s.setDistance);
  const setAlgorithm = useMapStore((s) => s.setAlgorithm);
  const getResult = useMapStore((s) => s.getResult);

  return (
    <section className="flex flex-col gap-2">
      <header className="mt-2 mb-4">
        <h2 className="text-lg font-semibold tracking-wide">{t('routeOptions_label')}</h2>
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

      <GenerateButton
        label={t('routeOptions_GenerateButton_label')}
        loadingLabel={t('routeOptions_GenerateButton_LoadingLabel')}
        loading={loading}
        onClick={async () => {
          await getResult();
        }}
      />
    </section>
  );
}
