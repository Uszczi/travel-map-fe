import L from 'leaflet';
import 'leaflet-arrowheads';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import React from 'react';
import { useMap } from 'react-leaflet';

const RouteWithArrows: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineLayer = L.polyline(positions, {
      color: 'blue',
    }).addTo(map);

    polylineLayer.arrowheads({
      yawn: 30,
      fill: false,
    });

    return () => {
      map.removeLayer(polylineLayer);
    };
  }, [map, positions]);

  return null;
};

export default RouteWithArrows;
