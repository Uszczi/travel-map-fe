'use client';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { warn } from 'console';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import RouteOptionsClient from '@/components/RouteOptions/RouteOptionsClient';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function MapWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={[
        'h-full grid gap-4 p-2',
        'transition-[grid-template-columns] duration-300',
        isSidebarOpen ? 'md:grid-cols-[500px_1fr]' : 'md:grid-cols-[44px_1fr]',
      ].join(' ')}
    >
      {/* ASIDE z uchwytem po prawej */}
      <aside id="route-options-aside" className="relative min-h-0 border rounded-lg overflow-hidden">
        {/* Zasadnicza zawartość panelu (chowana), uchwyt zostaje */}
        <div
          aria-hidden={!isSidebarOpen}
          className={[
            'h-full transition-opacity duration-200',
            isSidebarOpen ? 'opacity-100 pointer-events-auto p-4' : 'opacity-0 pointer-events-none p-0',






          ].join(' ')}

        >
          <RouteOptionsClient onCollapse={() => setIsSidebarOpen(false)} isCollapsed={!isSidebarOpen} />
        </div>

        {/* Uchwyt/pasek zawsze widoczny po prawej (gdy panel zwinięty) */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen((v) => !v)}
          aria-controls="route-options-aside"
          aria-expanded={isSidebarOpen}
          title={isSidebarOpen ? 'Zwiń panel' : 'Rozwiń panel'}
          className={[
            'absolute right-0 top-0 h-full w-[44px]',
            'flex items-center justify-center',
            'border-l over:bg-gray-50 focus:outline-none focus:ring',
            'rounded-r-lg',
            isSidebarOpen ? 'hidden' : '',
          ].join(' ')}
        >
          {isSidebarOpen ? (
            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" fixedWidth />
          ) : (
            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" fixedWidth />
          )}
        </button>
      </aside>

      {/* MAIN / MAPA */}
      <main className="min-h-[500px] h-full border rounded-lg flex flex-col overflow-hidden">
        <div className="min-h-[500px] flex-1">
          <Map />
        </div>
      </main>
    </div>
  );
}
