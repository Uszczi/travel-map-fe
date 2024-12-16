'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Rectangle, TileLayer } from 'react-leaflet';

import ApiService, { StravaRoute } from '@/components/services/api';

import RouteDetils from './RouteDetails';
import RouteWithArrows from './RouteWithArrows';
import { Route } from './services/api';

// Rozwiązanie problemu z ikonami markerów w Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  const center: [number, number] = [51.6101241, 19.1999532];

  const [displayLastRec, setDisplayLastRec] = useState(false);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stravaRoutes, setStravaRoutes] = useState<StravaRoute[]>([]);
  const [visitedRoutes, setVisitedRoutes] = useState<[number, number][][]>([]);
  const [displayRoutes, setDisplayRoutes] = useState<[number, number][][]>([]);
  const [distance, setDistance] = useState(1000);

  const addRandomRoute = async () => {
    const result = await ApiService.getRandomRoute(distance);

    setRoutes([result, ...routes]);
    setBounds([
      [result.rec[1], result.rec[0]],
      [result.rec[3], result.rec[2]],
    ]);

    const route: [number, number][] = [];
    for (let i = 0; i < result.x.length; i++) {
      route.push([result.y[i], result.x[i]]);
    }
    setDisplayRoutes([...displayRoutes, route]);
  };

  const displayStravaRoutes = async () => {
    const result = await ApiService.getStravaRoutes();
    setStravaRoutes(result);
  };

  const displayVisitedRoutes = async () => {
    const result = await ApiService.getVisitedRoutes();
    setVisitedRoutes(result);
  };

  const toggleDisplayLastRec = () => {
    setDisplayLastRec((prev) => !prev);
  };

  const clearAll = async () => {
    await ApiService.clear();
    clear();
  };

  const clear = () => {
    setVisitedRoutes([]);
    setStravaRoutes([]);
    setRoutes([]);
    setDisplayRoutes([]);
  };

  return (
    <div>
      <MapContainer center={center} zoom={13} style={{ width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {displayLastRec && bounds && <Rectangle bounds={bounds} pathOptions={{ color: 'red', fill: false }} />}

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
      <div className="flex space-x-4 border-blue-300">
        <div className="flex flex-1 flex-col items-center space-y-2">
          <button
            className="w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={clearAll}
          >
            Clear all
          </button>
          <button className="w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700" onClick={clear}>
            Clear page
          </button>
          <div className='flex items-center'>
            <div
              onClick={toggleDisplayLastRec}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                displayLastRec ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  displayLastRec ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <div className='ml-2'>Display last border</div>
          </div>
        </div>

        <div className="flex flex-1 justify-center items-center">
          <p className="mr-4">Odległość: {distance}</p>
          <input
            type="range"
            min="0"
            max="20000"
            value={distance}
            onChange={(event) => setDistance(+event.target.value)}
          />
        </div>

        <div className="flex flex-col flex-1 space-y-2">
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={addRandomRoute}
          >
            Add random route
          </button>
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={displayStravaRoutes}
          >
            Display raw Strava routes
          </button>
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={displayVisitedRoutes}
          >
            Display visited routes
          </button>
        </div>
      </div>
      <div style={{ overflow: 'auto', height: '250px' }}>
        {routes.map((route, index) => (
          <RouteDetils key={index} route={route} />
        ))}
      </div>
    </div>
  );
};

export default Map;
