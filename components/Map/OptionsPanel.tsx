'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AlgorithmPicker from '@/components/RouteOptions/AlgorithmPicker';
import type { Algorithm } from '@/components/types';
import { useMapOptions } from '@/src/store/useMapOptions';

import PointPickerSection from '@/components/RouteOptions/PointPickerSection';

export default function OptionsPanel() {
  const [algo, setAlgo] = useState<Algorithm>('dfs');

  const { start, end } = useMapOptions(useShallow((s) => ({ start: s.start, end: s.end })));
  const setStart = useMapOptions((s) => s.setStart);
  const setEnd = useMapOptions((s) => s.setEnd);

  return (
    <section>
      <header className="mt-2 mb-8">
        <h2 className="text-lg font-semibold tracking-wide">Ustawienia trasy</h2>
      </header>

      <PointPickerSection className="mb-5" legend="Punkt początkowy" which="start" point={start} setPoint={setStart} />
      <PointPickerSection className="mb-5" legend="Punkt końcowy" which="end" point={end} setPoint={setEnd} />

      <AlgorithmPicker value={algo} onChange={setAlgo} />
    </section>
  );
}
