'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import RouteWithArrows from '@/components/RouteWithArrows';
import ApiService, { Route, StravaRoute } from '@/src/services/api';
import { useMapStore } from '@/src/store/useMapStore';

// Rozwiązanie problemu z ikonami markerów w Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

const routeToPositions = (r: Route): [number, number][] => r.y.map((lat, i) => [lat, r.x[i]]);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER: [number, number] = [51.6101241, 19.1999532];

function RecenterOnStart({ start, fallback }: { start: [number, number] | null; fallback: [number, number] }) {
  const map = useMap();
  const lat = (start ?? fallback)[0];
  const lng = (start ?? fallback)[1];

  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  return null;
}

export default function Map() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { start: startSec, end: endSec, setCoords, setStart, setEnd, pinToAddress } = useMapStore();

  const center: [number, number] = [51.6101241, 19.1999532];
  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);

  const start = startSec.coords ? ([startSec.coords.lat, startSec.coords.lng] as [number, number]) : null;
  const end = endSec.coords ? ([endSec.coords.lat, endSec.coords.lng] as [number, number]) : null;

  const selecting: 'start' | 'end' | null = startSec.awaitingClick ? 'start' : endSec.awaitingClick ? 'end' : null;

  const [stravaRoutes, setStravaRoutes] = useState<StravaRoute[]>([]);
  const [visitedRoutes, setVisitedRoutes] = useState<[number, number][][]>([]);

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

  const _displayStravaRoutes = async () => {
    const result = await ApiService.getStravaRoutes();
    setStravaRoutes(result);
  };

  const _displayVisitedRoutes = async () => {
    const result = await ApiService.getVisitedRoutes();
    setVisitedRoutes(result);
  };

  const _clearAll = async () => {
    await ApiService.clear();
    clear();
  };

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

  const clear = () => {
    setVisitedRoutes([]);
    setStravaRoutes([]);
  };

  return (
    <div ref={wrapperRef} className="h-full h-min-[500px] w-full flex flex-col">
      <MapContainer center={center} zoom={13} style={{ flexGrow: 1 }}>
        <RecenterOnStart start={start} fallback={DEFAULT_CENTER} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {start && <Marker position={start} icon={startIcon} />}
        {end && <Marker position={end} icon={endIcon} />}
        {tempPosition && <Marker position={tempPosition} icon={selecting === 'start' ? startIcon : endIcon} />}

        {routes.map((r, i) => (
          <RouteWithArrows
            key={`gen-${i}`}
            positions={routeToPositions(r)}
            focused={i === routes.length - 1} // 👉 fokus na najnowszą trasę
          />
        ))}

        {stravaRoutes.map((item) => (
          <RouteWithArrows key={item.id} positions={item.xy} focused={false} />
        ))}

        {visitedRoutes.map((item, index) => (
          <RouteWithArrows key={index} positions={item} focused={false} />
        ))}
      </MapContainer>
    </div>
  );
}
