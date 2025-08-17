'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import OptionsPanel from '@/components/Map/OptionsPanel';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export type MapOptions = {
  showRoutes: boolean;
  zoomLevel: number;
};

export default function MapWithSidebar() {
  const [options, setOptions] = useState<MapOptions>({
    showRoutes: true,
    zoomLevel: 10,
  });

  return (
    <div className="flex w-full h-full">
      <aside className="w-100 shrink-0 p-4 border-r h-full">
        <OptionsPanel options={options} onChange={setOptions} />
      </aside>

      <main className="flex-1">
        <Map className="w-full h-full" options={options} />
      </main>
    </div>
  );
}
