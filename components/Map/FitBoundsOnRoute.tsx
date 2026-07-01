'use client';

import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  rec: [number, number, number, number] | null;
}

export default function FitBoundsOnRoute({ rec }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!rec) return;

    const [east, north, west, south] = rec;
    const center: L.LatLngTuple = [(south + north) / 2, (east + west) / 2];

    let raf = 0;

    map.whenReady(() => {
      raf = requestAnimationFrame(() => {
        map.setView(center, 14);
      });
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [map, rec]);

  return null;
}
