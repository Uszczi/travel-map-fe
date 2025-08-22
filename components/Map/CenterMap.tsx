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
  const lat = (center ?? fallback)[0];
  const lng = (center ?? fallback)[1];

  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  return null;
}
