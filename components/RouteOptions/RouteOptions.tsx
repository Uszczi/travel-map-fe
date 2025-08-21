'use client';

import { useShallow } from 'zustand/react/shallow';

import AdditionalPicker from '@/components/RouteOptions/AdditionalPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import { useMapStore } from '@/src/store/useMapStore';

export default function RouteOptions() {
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
  const setLoading = useMapStore((s) => s.setLoading);

  return (
    <section className="flex flex-col gap-2">
      <header className="mt-2 mb-4">
        <h2 className="text-lg font-semibold tracking-wide">Ustawienia trasy</h2>
      </header>

      <LocationPicker
        legend="Punkt początkowy"
        which="start"
        point={start}
        setPoint={setStart}
        setOtherPoint={setEnd}
      />

      <LocationPicker legend="Punkt końcowy" which="end" point={end} setPoint={setEnd} setOtherPoint={setStart} />

      <AlgorithmPicker legend="Algorytm" value={algorithm} onChange={setAlgorithm} />
      <DistancePicker legend="Dystans" value={distance} onChange={setDistance} />

      <AdditionalPicker legend="dodatkowe opcje todo" preferNewRoads={preferNew} setPreferNewRoads={setPreferNew} />

      <GenerateButton
        legend="TODO"
        loadingLegend="TODO"
        loading={loading}
        onClick={() => {
          setLoading(true);
        }}
      />
    </section>
  );
}
