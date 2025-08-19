'use client';

import dynamic from 'next/dynamic';

import OptionsPanelClient from '@/components/RouteOptions/OptionsPanelClient';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function MapWithSidebar() {
  return (
    <div className="h-full grid grid-cols-[500px_1fr] gap-4 p-2 overflow-hidden">
      <aside className="min-h-0 p-4 border rounded-lg overflow-auto">
        <OptionsPanelClient />
      </aside>

      <main className="min-h-0 h-full border rounded-lg overflow-hidden flex flex-col">
        <div className="min-h-0 flex-1">
          <Map />
        </div>
      </main>
    </div>
  );
}
