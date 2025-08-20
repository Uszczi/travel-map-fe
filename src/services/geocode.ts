export type BoundingBox = [number, number, number, number];

export interface GeocodeItem {
  id: number;
  label: string;
  lat: number;
  lng: number;
  type?: string;
  boundingbox?: BoundingBox;
}

export interface GeocodeResponse {
  items: GeocodeItem[];
}

// TODO add controllers
export async function geocodeSearch(q: string): Promise<GeocodeResponse> {
  if (!q || !q.trim()) throw new Error('Query cannot be empty');
  const url = `${process.env.NEXT_PUBLIC_API_URL}/geocode?q=${encodeURIComponent(q.trim())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function geocodeReverse(lat: number, lng: number): Promise<GeocodeItem> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/geocode?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
