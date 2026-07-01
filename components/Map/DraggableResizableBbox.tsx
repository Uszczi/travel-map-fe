'use client';

import L from 'leaflet';
import { useCallback, useMemo, useRef } from 'react';
import { Marker, Rectangle } from 'react-leaflet';

import { clampBbox } from '@/src/services/geocode';
import type { BoundingBox } from '@/src/services/geocode';
import type { LatLng, Which } from '@/src/store/routeOptionsSlice';
import { useMapStore } from '@/src/store/useMapStore';

interface Props {
  bbox: BoundingBox;
  color: string;
  which: Which;
  pinCoords?: LatLng;
}

function createCornerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;background:${color};border:2px solid white;border-radius:2px;cursor:nw-resize;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function createCenterDragIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.12);border:2px solid rgba(0,0,0,0.3);cursor:move;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function DraggableResizableBbox({ bbox, color, which, pinCoords }: Props) {
  const bboxRef = useRef(bbox);
  bboxRef.current = bbox;

  const setter = useMapStore((s) => (which === 'start' ? s.setStart : s.setEnd));

  const bounds: L.LatLngBoundsExpression = useMemo(
    () => [
      [bbox.south, bbox.west],
      [bbox.north, bbox.east],
    ],
    [bbox.south, bbox.north, bbox.west, bbox.east],
  );

  const center: [number, number] = useMemo(
    () => (pinCoords ? [pinCoords.lat, pinCoords.lng] : [(bbox.south + bbox.north) / 2, (bbox.west + bbox.east) / 2]),
    [pinCoords, bbox.south, bbox.north, bbox.west, bbox.east],
  );

  const corners: [number, number][] = useMemo(
    () => [
      [bbox.south, bbox.west],
      [bbox.south, bbox.east],
      [bbox.north, bbox.west],
      [bbox.north, bbox.east],
    ],
    [bbox.south, bbox.north, bbox.west, bbox.east],
  );

  const handleCenterDrag = useCallback(
    (e: L.LeafletEvent) => {
      const marker = e.target as L.Marker;
      const c = marker.getLatLng();
      const b = bboxRef.current;
      const halfLat = (b.north - b.south) / 2;
      const halfLng = (b.east - b.west) / 2;
      setter(
        'boundingbox',
        clampBbox(
          {
            south: c.lat - halfLat,
            north: c.lat + halfLat,
            west: c.lng - halfLng,
            east: c.lng + halfLng,
          },
          c.lng,
          c.lat,
        ),
      );
    },
    [setter],
  );

  const handleCornerDrag = useCallback(
    (index: number, e: L.LeafletEvent) => {
      const marker = e.target as L.Marker;
      const pos = marker.getLatLng();
      const b = bboxRef.current;
      const newBbox = {
        south: index < 2 ? pos.lat : b.south,
        north: index >= 2 ? pos.lat : b.north,
        west: index % 2 === 0 ? pos.lng : b.west,
        east: index % 2 === 1 ? pos.lng : b.east,
      };
      const centerLat = (newBbox.south + newBbox.north) / 2;
      const centerLng = (newBbox.west + newBbox.east) / 2;
      setter('boundingbox', clampBbox(newBbox, centerLng, centerLat));
    },
    [setter],
  );

  const cornerIcon = useMemo(() => createCornerIcon(color), [color]);
  const centerIcon = useMemo(() => createCenterDragIcon(), []);

  return (
    <>
      <Rectangle bounds={bounds} pathOptions={{ color, weight: 2, fillOpacity: 0.08 }} />
      <Marker position={center} icon={centerIcon} draggable eventHandlers={{ dragend: handleCenterDrag }} />
      {corners.map((pos, i) => (
        <Marker
          key={`${which}-corner-${i}`}
          position={pos}
          icon={cornerIcon}
          draggable
          eventHandlers={{ dragend: (e) => handleCornerDrag(i, e) }}
        />
      ))}
    </>
  );
}
