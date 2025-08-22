'use client';

import dynamic from 'next/dynamic';

import RouteOptionsClient from '@/components/RouteOptions/RouteOptionsClient';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function MapWithSidebar() {
  return (
    <div className="h-full grid gap-4 md:grid-cols-[500px_1fr] p-2">
      <aside className="min-h-0 p-4 border rounded-lg">
        <RouteOptionsClient />
      </aside>

      <main className="min-h-[500px] h-full border rounded-lg flex flex-col">
        <div className="min-h-0 flex-1">
          <Map />
        </div>
      </main>
    </div>
  );
}
