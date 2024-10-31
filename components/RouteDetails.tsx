import 'leaflet/dist/leaflet.css';
import React, {useState} from 'react';

import { Route } from './services/api';

type RouteDetilsProps = {
  route: Route;
};

const RouteDetils: React.FC<RouteDetilsProps> = ({ route }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

 const total_width = 1000;

  return (
    <div>
      <p>Trasa</p>
      <p>Dystans: {Math.round(route.distance)}m</p>
      <div className="flex">
        {route.segments.map((e, index) => (
          <div
          key={index}
            style={{
              width: `${Math.round((e.distance * total_width) / route.distance)}px`,
              height: '20px',
              background: e.new ? 'green' : 'brown',
              position: 'relative'
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
    </div>
  );
};

export default RouteDetils;
