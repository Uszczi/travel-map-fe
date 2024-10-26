export interface Segment {
  new: boolean
  distance: number
}
export interface Route {
  rec: [number, number, number, number];
  x: number[];
  y: number[];
  distance: number;
  segments: Segment[];
}

export default class ApiService {
  static async getRandomRoute(distance: number): Promise<Route> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route/random?distance=${distance}`);
    const result = await response.json();
    return result;
  }
}
