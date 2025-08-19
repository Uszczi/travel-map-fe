'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import AdditionalPicker from '@/components/RouteOptions/AdditionalPicker';
import type { Algorithm } from '@/components/types';
import { useMapOptions } from '@/src/store/useMapOptions';

export default function RouteOptions() {
  const [algo, setAlgo] = useState<Algorithm>('dfs');
  const [distance, setDistance] = useState(5);
  const [loading, _setLoading] = useState(false);
  const [progress, _setProgress] = useState<number | null>(null);

  const { start, end } = useMapOptions(useShallow((s) => ({ start: s.start, end: s.end })));
  const setStart = useMapOptions((s) => s.setStart);
  const setEnd = useMapOptions((s) => s.setEnd);

  return (
    <section className="flex flex-col gap-2">
      <header className="mt-2 mb-4">
        <h2 className="text-lg font-semibold tracking-wide">Ustawienia trasy</h2>
      </header>
      <LocationPicker legend="Punkt początkowy" which="start" point={start} setPoint={setStart} />
      <LocationPicker legend="Punkt końcowy" which="end" point={end} setPoint={setEnd} />
      <AlgorithmPicker legend="Algorytm" value={algo} onChange={setAlgo} />
      <DistancePicker legend="Dystans" value={distance} onChange={setDistance} />
      <AdditionalPicker legend='dodatkowe opcje todo' preferNewRoads={true} setPreferNewRoads={(v: boolean) => {} } />
      <GenerateButton legend="TODO" loadingLegend="TODO" loading={loading} progress={progress} onClick={() => {}} />
    </section>
  );
}
