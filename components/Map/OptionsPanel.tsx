'use client';

import type { Dispatch, SetStateAction } from 'react';

import type { MapOptions } from '@/components/types';

type Props = {
  options: MapOptions;
  onChange: Dispatch<SetStateAction<MapOptions>>;
};

export default function OptionsPanel({ options, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2></h2>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={options.showRoutes}
          onChange={(e) => onChange((prev) => ({ ...prev, showRoutes: e.target.checked }))}
        />
        Pokaż trasy
      </label>

      <label className="block">
        <span className="block text-sm mb-1">Zoom</span>
        <input
          className="border rounded px-2 py-1 w-full"
          type="number"
          value={options.zoomLevel}
          onChange={(e) => onChange((prev) => ({ ...prev, zoomLevel: Number(e.target.value) }))}
        />
      </label>
    </div>
  );
}
