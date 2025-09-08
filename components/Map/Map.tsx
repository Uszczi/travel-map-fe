'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import CenterMap from '@/components/Map/CenterMap';
import { endIcon, startIcon } from '@/components/Map/icons';
import Route from '@/components/Route';
import RouteWithArrows from '@/components/RouteWithArrows';
import { Route as RouteInterface } from '@/src/services/api';
import { useMapStore } from '@/src/store/useMapStore';

const routeToPositions = (r: RouteInterface): [number, number][] => r.y.map((lat, i) => [lat, r.x[i]]);

const DEFAULT_CENTER: [number, number] = [51.6101241, 19.1999532];

export default function Map() {
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!selecting) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (wrapperRef.current?.contains(target)) return;

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
    <div ref={wrapperRef} className="w-full flex flex-col" style={{ height: '60vh' }}>
      <MapContainer center={DEFAULT_CENTER} zoom={13} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <CenterMap center={start} fallback={DEFAULT_CENTER} />
        <MapClickHandler />

        {start && <Marker position={start} icon={startIcon} />}
        {end && <Marker position={end} icon={endIcon} />}
        {tempPosition && <Marker position={tempPosition} icon={selecting === 'start' ? startIcon : endIcon} />}

        {routes.map((r, i) => (
          <RouteWithArrows key={`gen-${i}`} positions={routeToPositions(r)} focused={i === routes.length - 1} />
        ))}

        {displayVisitedRoutes && visitedRoutes.map((r, i) => <Route key={`gen-${i}`} positions={r} />)}
      </MapContainer>
    </div>
  );
}
