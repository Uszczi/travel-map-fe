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

type RequestOptions = {
  signal?: AbortSignal;
};

let searchController: AbortController | null = null;
let reverseController: AbortController | null = null;

export async function geocodeSearch(q: string, options: RequestOptions = {}): Promise<GeocodeResponse> {
  if (!q || !q.trim()) throw new Error('Query cannot be empty');

  const url = `${process.env.NEXT_PUBLIC_API_URL}/geocode?q=${encodeURIComponent(q.trim())}`;

  let controller: AbortController | null = null;
  let signal: AbortSignal | undefined = options.signal;

  if (!signal) {
    if (searchController) {
      searchController.abort();
    }
    controller = new AbortController();
    searchController = controller;
    signal = controller.signal;
  }

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    if (controller && searchController === controller) {
      searchController = null;
    }
  }
}

export async function geocodeReverse(lat: number, lng: number, options: RequestOptions = {}): Promise<GeocodeItem> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/geocode?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`;

  let controller: AbortController | null = null;
  let signal: AbortSignal | undefined = options.signal;

  if (!signal) {
    if (reverseController) {
      reverseController.abort();
    }
    controller = new AbortController();
    reverseController = controller;
    signal = controller.signal;
  }

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    if (controller && reverseController === controller) {
      reverseController = null;
    }
  }
}
