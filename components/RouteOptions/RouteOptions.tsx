'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AdditionalPicker from '@/components/RouteOptions/AdditionalPicker';
import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import GenerateButton from '@/components/RouteOptions/GenerateButton';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import type { Algorithm } from '@/components/types';
import { useMapStore } from '@/src/store/useMapStore';

export default function RouteOptions() {
  const [algo, setAlgo] = useState<Algorithm>('dfs');
  const [distance, setDistance] = useState(5);
  const [loading, _setLoading] = useState(false);

  const { start, end } = useMapStore(useShallow((s) => ({ start: s.start, end: s.end })));
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);

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
      <AlgorithmPicker legend="Algorytm" value={algo} onChange={setAlgo} />
      <DistancePicker legend="Dystans" value={distance} onChange={setDistance} />
      <AdditionalPicker legend="dodatkowe opcje todo" preferNewRoads={true} setPreferNewRoads={(_v: boolean) => {}} />
      <GenerateButton legend="TODO" loadingLegend="TODO" loading={loading} onClick={() => {}} />
    </section>
  );
}
