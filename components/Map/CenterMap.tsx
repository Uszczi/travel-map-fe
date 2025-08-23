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
    let raf = 0;

    map.whenReady(() => {
      raf = requestAnimationFrame(() => {
        map.setView([lat, lng]);
      });
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [map, lat, lng]);

  return null;
}
