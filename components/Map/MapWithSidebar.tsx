'use client';

import dynamic from 'next/dynamic';
import type { MapOptions } from '@/components/types';
import OptionsPanelClient from './OptionsPanelClient';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function MapWithSidebar() {
  const initial: MapOptions = { showRoutes: true, zoomLevel: 12 };

  return (
    <div className="h-full grid grid-cols-[500px_1fr] gap-4 p-2 overflow-hidden">
      <aside className="min-h-0 p-4 border rounded-lg overflow-auto">
        <OptionsPanelClient initialOptions={initial} />
      </aside>

      <main className="min-h-0 border rounded-lg overflow-hidden flex flex-col">
        <div className="min-h-0 flex-1">
          <Map options={initial}  />
        </div>
      </main>
    </div>
  );
}
