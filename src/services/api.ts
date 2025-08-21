import { Algorithm, LatLng } from '@/components/types';

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
  static async get(
    algorithm: Algorithm,
    start: LatLng | null,
    end: LatLng | null,
    distance: number,
    preferNew: boolean,
  ): Promise<Route> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/route/${algorithm}?distance=${distance}&prefer_new=${preferNew}`;
    if (start) url += `&start_x=${start.lat}&start_y=${start.lng}`;
    if (end) url += `&end_x=${end.lat}&end_y=${end.lng}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static async stravaRoutesToVisited(): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/strava-to-visited`;
    await fetch(url);
  }

  static async getRandomRoute(
    distance: number,
    start: [number, number] | null,
    end: [number, number] | null,
    preferNew: boolean,
  ): Promise<Route> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/route/random?distance=${distance}&prefer_new=${preferNew}`;
    if (start) url += `&start_x=${start[1]}&start_y=${start[0]}`;
    if (end) url += `&end_x=${end[1]}&end_y=${end[0]}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static async getAStarRoute(
    distance: number,
    start: [number, number] | null,
    end: [number, number] | null,
    preferNew: boolean,
  ): Promise<Route> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/route/astar?distance=${distance}&prefer_new=${preferNew}`;
    if (start) url += `&start_x=${start[1]}&start_y=${start[0]}`;
    if (end) url += `&end_x=${end[1]}&end_y=${end[0]}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  static async getDFSRoute(
    distance: number,
    start: [number, number] | null,
    end: [number, number] | null,
    preferNew: boolean,
  ): Promise<Route> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/route/dfs?distance=${distance}&prefer_new=${preferNew}`;
    if (start) url += `&start_x=${start[1]}&start_y=${start[0]}`;
    if (end) url += `&end_x=${end[1]}&end_y=${end[0]}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
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
