'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import OptionsPanel from '@/components/Map/OptionsPanel';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export type MapOptions = { showRoutes: boolean; zoomLevel: number };

export default function MapWithSidebar() {
  const [options, setOptions] = useState<MapOptions>({ showRoutes: true, zoomLevel: 10 });

  return (
    <div className="flex h-full min-h-0 w-full">
      <aside className="w-100 shrink-0 p-4 border-r overflow-y-auto">
        <OptionsPanel options={options} onChange={setOptions} />
      </aside>

      <main className="flex-1 min-h-0 p-4 flex items-center justify-center ">
        <div className="w-full h-full">
          <Map options={options} />
        </div>
      </main>
    </div>
  );
}
