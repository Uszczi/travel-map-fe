import { Algorithm, LatLng } from '@/components/types';

import type { BoundingBox } from './geocode';

export interface Segment {
  new: boolean;
  distance: number;
}
export interface Route {
  rec: [number, number, number, number];
  // TODO
  x: number[]; // lon[]
  y: number[]; // lat[]
  distance: number;
  segments: Segment[];
  elevation: number[];
  total_gain: number;
  total_lose: number;
  total_new: number;
  total_old: number;
  percent_of_new: number;
}

export interface StravaRoute {
  id: number;
  xy: [number, number][];
  type: string;
  name: string;
}

export default class ApiService {
  static async get(params: {
    algorithm: Algorithm;
    start?: LatLng | null;
    end?: LatLng | null;
    distance: number;
    preferNew: boolean;
    startBbox?: BoundingBox;
    endBbox?: BoundingBox;
    timeout?: number;
  }): Promise<Route> {
    const { algorithm, start, end, distance, preferNew, startBbox, endBbox, timeout = 3000_000 } = params;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/route/${algorithm}?distance=${distance}&prefer_new=${preferNew}`;
      if (start) url += `&start_x=${start.lng}&start_y=${start.lat}`;
      if (end) url += `&end_x=${end.lng}&end_y=${end.lat}`;
      if (startBbox) {
        url += `&start_bbox_south=${startBbox.south}&start_bbox_north=${startBbox.north}`;
        url += `&start_bbox_west=${startBbox.west}&start_bbox_east=${startBbox.east}`;
      }
      if (endBbox) {
        url += `&end_bbox_south=${endBbox.south}&end_bbox_north=${endBbox.north}`;
        url += `&end_bbox_west=${endBbox.west}&end_bbox_east=${endBbox.east}`;
      }

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  static async stravaRoutesToVisited(): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/strava-to-visited`;
    await fetch(url);
  }

  static async getVisitedRoutes(): Promise<[number, number][][]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visited-routes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static async clear(): Promise<void> {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clear`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  }

  static async getStravaRoutes(): Promise<StravaRoute[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/strava/routes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static async downloadGPXFromRoute(route: Route, title: string): Promise<void> {
    const hasEle = Array.isArray(route.elevation) && route.elevation.length === route.x.length;

    // TODO check
    // (lat, lon[, ele])
    const points = route.y.map((lat, i) => {
      const lon = route.x[i];
      if (hasEle) return [lat, lon, route.elevation[i]];
      return [lat, lon];
    });

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route-to-gpx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points, title }),
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => '');
      throw new Error(`Nie udało się wygenerować GPX: ${resp.status} ${msg}`);
    }

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(title)}.gpx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}

function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[/?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .slice(0, 120);
}
