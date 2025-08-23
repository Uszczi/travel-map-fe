'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  center: [number, number] | null;
  fallback: [number, number];
}

export default function CenterMap({ center, fallback }: Props) {
  const map = useMap();
  const [lat, lng] = center ?? fallback;

  useEffect(() => {
    const apply = () => map.setView([lat, lng]);

    // jeśli mapa już ma utworzone DOM-pane (najpewniejszy warunek)
    if ((map as any)._mapPane) {
      // odłóż o 1 klatkę – omija glitche StrictMode/dev
      const id = requestAnimationFrame(apply);
      return () => cancelAnimationFrame(id);
    }

    // pierwsze załadowanie
    map.once('load', apply);
    return () => {
      map.off('load', apply);
    };
  }, [map, lat, lng]);

  return null;
}
