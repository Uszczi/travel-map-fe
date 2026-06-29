'use client';

import L from 'leaflet';
import 'leaflet-arrowheads';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef } from 'react';
import { useMap } from 'react-leaflet';

import type { Route, Segment } from '@/src/services/api';

function routeToPositions(r: Route): [number, number][] {
  if (!Array.isArray(r.y) || !Array.isArray(r.x)) return [];
  return r.y.map((lat, i) => [lat, r.x[i]]);
}

function splitIntoSegments(positions: [number, number][], segments: Segment[]): [number, number][][] {
  if (!segments?.length) return positions.length > 0 ? [positions] : [];

  const totalDistance = segments.reduce((s, seg) => s + seg.distance, 0);
  if (totalDistance <= 0) return [positions];

  const chunks: [number, number][][] = [];
  let cumRatio = 0;

  for (const seg of segments) {
    const ratio = seg.distance / totalDistance;
    const startIdx = Math.round(cumRatio * (positions.length - 1));
    cumRatio += ratio;
    const endIdx = Math.round(cumRatio * (positions.length - 1));
    chunks.push(positions.slice(startIdx, endIdx + 1));
  }

  return chunks;
}

type AnimatedRouteProps = {
  route: Route;
  focused?: boolean;
};

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ route, focused = true }) => {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);

  const positions = useMemo(() => routeToPositions(route), [route]);
  const segments = route.segments ?? [];
  const chunks = useMemo(() => splitIntoSegments(positions, segments), [positions, segments]);

  useEffect(() => {
    if (!map || chunks.length === 0 || positions.length < 2) return;

    const polyline = L.polyline([], {
      color: focused ? 'green' : 'blue',
      weight: 3,
    }).addTo(map);

    polyline.setLatLngs(chunks[0]);

    polyline.arrowheads({
      size: '10m',
      yawn: 30,
      fill: false,
      color: focused ? 'green' : 'blue',
    });

    polylineRef.current = polyline;

    if (chunks.length <= 1) {
      return () => {
        map.removeLayer(polyline);
        polylineRef.current = null;
      };
    }

    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      const coords = chunks.slice(0, idx + 1).flat();
      polyline.setLatLngs(coords);
      if (idx >= chunks.length - 1) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      map.removeLayer(polyline);
      polylineRef.current = null;
    };
  }, [map, positions, chunks, focused]);

  return null;
};

export default AnimatedRoute;
