export interface Segment {
  new: boolean;
  distance: number;
}
export interface Route {
  rec: [number, number, number, number];
  x: number[];
  y: number[];
  distance: number;
  segments: Segment[];
}
export interface StravaRoute {
    id: number
    xy: [number, number][]
    type: string
    name: string
}

export default class ApiService {
  static async getRandomRoute(distance: number, start: [number, number] | null): Promise<Route> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/route/random?distance=${distance}`
    if (start) {
      url += `&start_x=${start[1]}&start_y=${start[0]}`
    }
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  static async getVisitedRoutes(): Promise<[number,number][][]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visited-routes`);
    const result = await response.json();
    return result;
  }

  static async clear(): Promise<void> {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clear`);
  }

  static async getStravaRoutes(): Promise<StravaRoute[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/strava/routes`);
    const result = await response.json();
    return result;
  }
}
