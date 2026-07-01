'use client';

import 'leaflet/dist/leaflet.css';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import AnimatedRoute from '@/components/AnimatedRoute';
import CenterMap from '@/components/Map/CenterMap';
import DraggableResizableBbox from '@/components/Map/DraggableResizableBbox';
import FitBoundsOnRoute from '@/components/Map/FitBoundsOnRoute';
import { endIcon, startIcon } from '@/components/Map/icons';
import Route from '@/components/Route';
import RouteWithArrows from '@/components/RouteWithArrows';
import { Route as RouteInterface } from '@/src/services/api';
import { useMapStore } from '@/src/store/useMapStore';

const routeToPositions = (r: RouteInterface): [number, number][] => {
  if (!Array.isArray(r.y) || !Array.isArray(r.x)) return [];
  return r.y.map((lat, i) => [lat, r.x[i]]);
};

const DEFAULT_CENTER: [number, number] = [51.6101241, 19.1999532];

export default function Map() {
  const t = useTranslations('map');
  const startSec = useMapStore((s) => s.start);
  const endSec = useMapStore((s) => s.end);
  const setCoords = useMapStore((s) => s.setCoords);
  const setStart = useMapStore((s) => s.setStart);
  const setEnd = useMapStore((s) => s.setEnd);
  const pinToAddress = useMapStore((s) => s.pinToAddress);
  const visitedRoutes = useMapStore((s) => s.visitedRoutes.results);
  const displayVisitedRoutes = useMapStore((s) => s.visitedRoutes.display);

  const start = startSec.coords ? ([startSec.coords.lat, startSec.coords.lng] as [number, number]) : null;
  const end = endSec.coords ? ([endSec.coords.lat, endSec.coords.lng] as [number, number]) : null;
  const selecting: 'start' | 'end' | null = startSec.awaitingClick ? 'start' : endSec.awaitingClick ? 'end' : null;

  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);

  const routes = useMapStore((s) => s.results);
  const animationSpeed = useMapStore((s) => s.animationSpeed);
  const skipAnimation = useMapStore((s) => s.skipAnimation);
  const lastRec = routes.length > 0 ? routes[routes.length - 1].rec : null;
  const animationEnabled = useMapStore((s) => s.animationEnabled);
  const setAnimationEnabled = useMapStore((s) => s.setAnimationEnabled);
  const triggerSkipAnimation = useMapStore((s) => s.triggerSkipAnimation);

  useEffect(() => {
    if (!selecting) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('.leaflet-container')) return;

      if (target.closest('[data-pick-toggle]')) return;

      if (startSec.awaitingClick) setStart('awaitingClick', false);
      if (endSec.awaitingClick) setEnd('awaitingClick', false);
      setTempPosition(null);
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () =>
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true } as EventListenerOptions);
  }, [selecting, startSec.awaitingClick, endSec.awaitingClick, setEnd, setStart]);

  const MapClickHandler = () => {
    useMapEvents({
      mousemove(e) {
        if (selecting) {
          setTempPosition([e.latlng.lat, e.latlng.lng]);
        }
      },
      click(e) {
        if (!selecting) return;
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        pinToAddress(selecting);
        setTempPosition(null);
      },
    });
    return null;
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] h-[600px]">
      <MapContainer center={DEFAULT_CENTER} zoom={13} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={t('attribution')} />

        <CenterMap center={start} fallback={DEFAULT_CENTER} />
        <FitBoundsOnRoute rec={lastRec} />
        <MapClickHandler />

        {start && <Marker position={start} icon={startIcon} />}
        {end && <Marker position={end} icon={endIcon} />}
        {tempPosition && <Marker position={tempPosition} icon={selecting === 'start' ? startIcon : endIcon} />}

        {startSec.boundingbox && <DraggableResizableBbox bbox={startSec.boundingbox} color="#22c55e" which="start" />}
        {endSec.boundingbox && <DraggableResizableBbox bbox={endSec.boundingbox} color="#ef4444" which="end" />}

        {routes.map((r, i) => {
          const isFocused = i === routes.length - 1;
          if (animationEnabled && isFocused) {
            return (
              <AnimatedRoute key={`gen-${i}`} route={r} focused speed={animationSpeed} skipCounter={skipAnimation} />
            );
          }
          return <RouteWithArrows key={`gen-${i}`} positions={routeToPositions(r)} focused={isFocused} />;
        })}

        {displayVisitedRoutes && visitedRoutes.map((r, i) => <Route key={`gen-${i}`} positions={r} />)}
      </MapContainer>

      <div className="px-4 py-2 border-t flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setAnimationEnabled(!animationEnabled)}
          className="px-4 py-1.5 text-sm font-medium border rounded hover:bg-gray-50 active:translate-y-px transition-transform"
        >
          {animationEnabled ? t('toggleAnimation.disable') : t('toggleAnimation.enable')}
        </button>
      </div>
    </div>
  );
}
