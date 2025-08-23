'use client';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import RouteOptionsClient from '@/components/RouteOptions/RouteOptionsClient';

const Map = dynamic(() => import('@/components/Map/Map'), { ssr: false });

export default function MapWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={[
        'flex flex-col h-[100dvh] min-h-0 p-2',
        'md:grid md:gap-4 md:h-full',
        'transition-[grid-template-columns] duration-300',
        isSidebarOpen ? 'md:grid-cols-[500px_1fr]' : 'md:grid-cols-[44px_1fr]',
      ].join(' ')}
    >
      <aside
        id="route-options-aside"
        className={[
          'relative border rounded-lg overflow-hidden',
          'transition-[height] duration-300',
          isSidebarOpen ? 'h-[70dvh] md:h-auto' : 'h-[44px] md:h-auto',
          'md:min-h-0',
        ].join(' ')}
        aria-expanded={isSidebarOpen}
      >
        {/* TREŚĆ PANELU */}
        <div
          className={[
            'md:h-auto',
            'h-full',
            'overflow-y-auto',
            'transition-opacity duration-200',
            isSidebarOpen ? 'opacity-100 pointer-events-auto p-4' : 'opacity-0 pointer-events-none p-0',
          ].join(' ')}
          aria-hidden={!isSidebarOpen}
        >
          <RouteOptionsClient
            onCollapse={() => setIsSidebarOpen(false)}
            isCollapsed={!isSidebarOpen}
          />
        </div>

        {/* UCHWYT — z pionowym napisem widocznym, gdy panel jest zwinięty */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(v => !v)}
          aria-controls="route-options-aside"
          aria-label={isSidebarOpen ? 'Zwiń panel' : 'Rozwiń panel'}
          title={isSidebarOpen ? 'Zwiń panel' : 'Rozwiń panel'}
          className={[
            'flex',
            'absolute right-0 top-0 h-full w-[44px]',
            'items-center justify-center',
            'border-l hover:bg-gray-50 focus:outline-none focus:ring',
            'rounded-r-lg',
            // uchwyt jest ukryty, gdy panel otwarty
            isSidebarOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
          ].join(' ')}
        >
          <div className="flex flex-col items-center justify-center gap-3 h-full">
            {/* NAPIS widoczny tylko przy zwinięciu */}
            <span
              className={[
                'text-[10px] md:text-xs font-semibold tracking-wide uppercase',
                'select-none',
                // pionowe pisanie + 180°, żeby czytać od dołu do góry
                '[writing-mode:vertical-rl] rotate-180',
                // zapewnia, że tekst nie łamie się brzydko
                'whitespace-nowrap',
                // na wszelki wypadek reset linii bazowej
                'leading-none',
              ].join(' ')}
            >
              RouteOptions
            </span>

            {/* Ikona strzałki */}
            <FontAwesomeIcon
              icon={isSidebarOpen ? faChevronLeft : faChevronRight}
              className="h-5 w-5"
              fixedWidth
            />
          </div>
        </button>
      </aside>

      <main className="flex-1 min-h-0 border rounded-lg flex flex-col">
        <div className="flex-1 min-h-0">
          <Map />
        </div>
      </main>
    </div>
  );
}
