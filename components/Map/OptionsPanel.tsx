'use client';

import { useShallow } from 'zustand/react/shallow';

import { useMapOptions } from '@/src/store/useMapOptions';

import PointPickerSection from './PointPickerSection';

export default function OptionsPanel() {
  const { start, end } = useMapOptions(useShallow((s) => ({ start: s.options.start, end: s.options.end })));

  const setStart = useMapOptions((s) => s.setStart);
  const setEnd = useMapOptions((s) => s.setEnd);

  return (
    <section>
      <header className="mt-2 mb-8">
        <h2 className="text-lg font-semibold tracking-wide">Ustawienia trasy</h2>
      </header>

      <PointPickerSection className="mb-5" legend="Punkt początkowy" which="start" point={start} setPoint={setStart} />

      <PointPickerSection legend="Punkt końcowy" which="end" point={end} setPoint={setEnd} />
    </section>
  );
}
