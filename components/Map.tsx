'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, Rectangle, TileLayer, useMapEvents } from 'react-leaflet';

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

const Map = () => {
  const center: [number, number] = [51.6101241, 19.1999532];

  const [displayLastRec, setDisplayLastRec] = useState(false);
  const [preferNew, setPreferNew] = useState(false);
  const [routendTrip, setRoutendTrip] = useState(true);

  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stravaRoutes, setStravaRoutes] = useState<StravaRoute[]>([]);
  const [visitedRoutes, setVisitedRoutes] = useState<[number, number][][]>([]);
  const [displayRoutes, setDisplayRoutes] = useState<[number, number][][]>([]);
  const [distance, setDistance] = useState(3000);

  const addRandomRoute = async () => {
    const result = await ApiService.getRandomRoute(distance, (showStart)? start : null, (showEnd)? end : null, preferNew);

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

  const addNextRoute = async () => {
    const result = await ApiService.getNextRoute();

    setRoutes([result, ...routes]);

    const route: [number, number][] = [];
    for (let i = 0; i < result.x.length; i++) {
      route.push([result.y[i], result.x[i]]);
    }
    setDisplayRoutes([...displayRoutes, route]);
  };

  const removeRoute = (indexToRemove: number) => {
    setRoutes((prevRoutes) => prevRoutes.filter((_, index) => index !== indexToRemove));

    indexToRemove = displayRoutes.length - indexToRemove - 1;
    setDisplayRoutes((prevDisplayRoutes) => prevDisplayRoutes.filter((_, index) => index !== indexToRemove));
  };

  const addDFSRoute = async () => {
    let tmpEnd = end
    if (routendTrip) {
      tmpEnd = start
    }

    const result = await ApiService.getDFSRoute(distance, start, tmpEnd);

    setRoutes([result, ...routes]);

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

  const togglePreferNew = () => {
    setPreferNew((prev) => !prev);
  };

  const clearAll = async () => {
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
        if (selecting === 'start') {
          setStart([e.latlng.lat, e.latlng.lng]);
          setTempPosition(null);
          setSelecting(null);
        } else if (selecting === 'end') {
          setEnd([e.latlng.lat, e.latlng.lng]);
          setTempPosition(null);
          setSelecting(null);
        }
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
    <div>
      <MapContainer center={center} zoom={13} style={{ width: '100%' , height: '900px'}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {start && <Marker position={start} icon={startIcon} />}
        {end && <Marker position={end} icon={endIcon} />}
        {tempPosition && <Marker position={tempPosition} icon={selecting === 'start' ? startIcon : endIcon} />}

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
          <div className="flex items-center">
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
            <div className="ml-2">Display last border</div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center space-y-2">
          <div className="flex items-center mt-4">
            <div
              onClick={togglePreferNew}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                preferNew ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  preferNew ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <div className="ml-2">Prefer new</div>
          </div>
        </div>

        <div className="flex flex-1 justify-center items-center flex-col space-y-2">
          <div>
            <p className="mr-4">Distance: {distance}</p>
            <input
              type="range"
              min="0"
              max="20000"
              value={distance}
              onChange={(event) => setDistance(+event.target.value)}
            />
            <select
              value={distance}
              onChange={(event) => setDistance(+event.target.value)}
              className="bg-white border border-gray-300 rounded px-4 py-2"
            >
              <option value={3000}>3 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={15000}>15 km</option>
            </select>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setRoutendTrip((prev) => !prev)}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer bg-gray-300`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  routendTrip ? 'translate-x-0' : 'translate-x-6'
                }`}
              ></div>
            </div>
            <div className="ml-2">{routendTrip ? 'Rounded trip' : 'Start - end'}</div>
          </div>

          <div className='flex'>
          <button
            className="w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setSelecting('start')}
          >
            Select Start
          </button>
          <div className="flex items-center">
            <div
              onClick={() => setShowStart((prev) => !prev)}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                showStart ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  showStart ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <div className="ml-2">Show start</div>
          </div>

          </div>


          <div className='flex'>
          <button
            className="w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setSelecting('end')}
          >
            Select End
          </button>
          <div className="flex items-center">
            <div
              onClick={() => setShowEnd((prev) => !prev)}
              className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                showEnd ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  showEnd ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <div className="ml-2">Show end</div>
          </div>
        </div>
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
            onClick={addDFSRoute}
          >
            Add DFS route
          </button>
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={addNextRoute}
          >
            Add next route
          </button>
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={displayStravaRoutes}
          >
            Display raw Strava routes
          </button>
          <button
            className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={async () => await ApiService.stravaRoutesToVisited()}
          >
            Strava routes to visited routes
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
          <RouteDetils key={index} route={route} onRemove={() => removeRoute(index)} />
        ))}
      </div>
    </div>
  );
};

export default Map;
