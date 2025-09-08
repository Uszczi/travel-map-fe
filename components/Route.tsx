import L from 'leaflet';
import 'leaflet-arrowheads';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  positions: [number, number][];
}

export default function Route({ positions }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineLayer = L.polyline(positions, {
      color: 'blue',
    }).addTo(map);

    return () => {
      map.removeLayer(polylineLayer);
    };
  }, [map, positions]);

  return null;
}
