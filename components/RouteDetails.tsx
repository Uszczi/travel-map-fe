import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'leaflet/dist/leaflet.css';
import React, { MouseEventHandler, useMemo, useState } from 'react';

import ElevationChart from './ElevationChart';
import { Route, Segment } from './services/api';

type RouteDetilsProps = {
  route: Route;
  onRemove: MouseEventHandler;
};

function combineSegmentsIfNew(segments: Segment[]): Segment[] {
  const result = [];
  let lastSegment = { ...segments[0] };

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];

    if (lastSegment.new != segment.new) {
      result.push(lastSegment);
      lastSegment = { ...segment };
    } else {
      lastSegment.distance += segment.distance;
    }
  }

  result.push(lastSegment);

  return result;
}

const RouteDetils: React.FC<RouteDetilsProps> = ({ route, onRemove }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const total_width = 1000;

  const combinedSegments = useMemo(() => combineSegmentsIfNew(route.segments), [route.segments]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="font-bold text-lg">Trasa</p>
      </div>

      <div className="flex items-center">
        <p className="text-sm">Dystans: {Math.round(route.distance)}m</p>
        <p className="text-sm ml-2">Nowe trasy: {Math.round(route.total_new)}m</p>
        <p className="text-sm ml-2">Stare trasy: {Math.round(route.total_old)}m</p>
        <p className="text-sm ml-2">Procent nowych: {Math.round(route.percent_of_new)}%</p>
        <button className="text-red-500 hover:text-red-700" onClick={onRemove} title="Usuń trasę">
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
      </div>

      <div className="flex">
        {combinedSegments.map((e, index) => (
          <div
            key={index}
            style={{
              width: `${Math.round((e.distance * total_width) / route.distance)}px`,
              height: '20px',
              background: e.new ? 'green' : 'brown',
              position: 'relative',
            }}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {hoveredSegment === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                {Math.round(e.distance)}m
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex" style={{ height: '200px' }}>
        <div>
          <p className="text-2xl font-bold mb-4">Profil wysokości</p>
          <p>Całkowity wznos: {route.total_gain}</p>
          <p>Całkowity spadek: {route.total_lose}</p>
        </div>
        <ElevationChart elevation={route.elevation} />
      </div>
    </div>
  );
};

export default RouteDetils;
