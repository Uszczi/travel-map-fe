

export interface Route {
    rec: [number, number, number, number]
    x: number[]
    y: number[]
    distance: number
}


export default class ApiService {
  static async getRandomRoute(): Promise<Route> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route/random`);
    const result = await response.json();
    return result;
  }
}


