'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import RouteWithArrows from '@/components/RouteWithArrows';
import ApiService, { StravaRoute } from '@/components/services/api';
import { Route } from '@/components/services/api';
import { useMapOptions } from '@/src/store/useMapOptions';

// Rozwiązanie problemu z ikonami markerów w Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

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

export default function Map() {
  const center: [number, number] = [51.6101241, 19.1999532];
  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);

  const { start: startSec, end: endSec, setCoords } = useMapOptions();
  const start = startSec.coords ? ([startSec.coords.lat, startSec.coords.lng] as [number, number]) : null;
  const end = endSec.coords ? ([endSec.coords.lat, endSec.coords.lng] as [number, number]) : null;

  const selecting: 'start' | 'end' | null = startSec.awaitingClick ? 'start' : endSec.awaitingClick ? 'end' : null;

  const [_routes, setRoutes] = useState<Route[]>([]);
  const [stravaRoutes, setStravaRoutes] = useState<StravaRoute[]>([]);
  const [visitedRoutes, setVisitedRoutes] = useState<[number, number][][]>([]);
  const [displayRoutes, setDisplayRoutes] = useState<[number, number][][]>([]);

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
        setTempPosition(null);
      },
    });
    return null;
  };

  const clear = () => {
    setVisitedRoutes([]);
    setStravaRoutes([]);
    setRoutes([]);
    setDisplayRoutes([]);
  };

  return (
    <div className={`h-full w-full flex flex-col `}>
      <MapContainer center={center} zoom={13} style={{ flexGrow: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {start && <Marker position={start} icon={startIcon} />}
        {end && <Marker position={end} icon={endIcon} />}
        {tempPosition && <Marker position={tempPosition} icon={selecting === 'start' ? startIcon : endIcon} />}

        {displayRoutes.length > 0 &&
          displayRoutes.map((item, index) => (
            <RouteWithArrows key={index} positions={item} focused={index + 1 === displayRoutes.length} />
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
