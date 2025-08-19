'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import DistancePicker from '@/components/RouteOptions/DistancePicker';
import LocationPicker from '@/components/RouteOptions/LocationPicker';
import type { Algorithm } from '@/components/types';
import { useMapOptions } from '@/src/store/useMapOptions';

export default function RouteOptions() {
  const [algo, setAlgo] = useState<Algorithm>('dfs');
  const [distance, setDistance] = useState(5);

  const { start, end } = useMapOptions(useShallow((s) => ({ start: s.start, end: s.end })));
  const setStart = useMapOptions((s) => s.setStart);
  const setEnd = useMapOptions((s) => s.setEnd);

  return (
    <section>
      <header className="mt-2 mb-4">
        <h2 className="text-lg font-semibold tracking-wide">Ustawienia trasy</h2>
      </header>

      <LocationPicker className="mb-2" legend="Punkt początkowy" which="start" point={start} setPoint={setStart} />
      <LocationPicker className="mb-2" legend="Punkt końcowy" which="end" point={end} setPoint={setEnd} />
      <AlgorithmPicker className="mb-2" legend="Algorytm" value={algo} onChange={setAlgo} />
      <DistancePicker legend="Maksymalny dystans" value={distance} onChange={setDistance} min={3} max={50} step={1} />
    </section>
  );
}
