import L from 'leaflet';
import 'leaflet-arrowheads';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import React from 'react';
import { useMap } from 'react-leaflet';

const RouteWithArrows: React.FC<{ positions: [number, number][], focused: boolean}> = ({ positions, focused = false }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineLayer = L.polyline(positions, {
      color: focused ? 'green': 'blue',
    }).addTo(map);

    const addArrowheads = (color: string) => {
      polylineLayer.deleteArrowheads();
      polylineLayer.arrowheads({
        size: '10m',
        yawn: 30,
        fill: false,
        color: color,
      });
    };
    addArrowheads(focused ? 'red': 'blue');

    if (!focused) {
      polylineLayer.on('mouseover', () => {
        polylineLayer.setStyle({ color: 'red' });
        polylineLayer.bringToFront();
      });

      polylineLayer.on('mouseout', () => {
        polylineLayer.setStyle({ color: 'blue' });
        polylineLayer.bringToBack();
      });
    }

    return () => {
      map.removeLayer(polylineLayer);
    };
  }, [map, positions, focused]);

  return null;
};

export default RouteWithArrows;
