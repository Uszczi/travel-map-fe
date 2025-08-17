import { NextResponse } from 'next/server';

type NominatimResponseItem = {
  place_id: number | string;
  display_name: string;
  lat: string; // Nominatim zwraca jako string
  lon: string;
  type?: string;
  class?: string;
  boundingbox?: [string, string, string, string];
};

const NOMINATIM_URL = process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org/search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ error: 'Missing query param: q' }, { status: 400 });
  }

  // Uproszczone proxy do Nominatim (JSON, 5 wyników, format przyjazny dla UI)
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');

  try {
    const res = await fetch(url.toString(), {
      // Nominatim wymaga sensownego UA
      headers: {
        'User-Agent': 'CityTravelApp/1.0 (contact: your-email@example.com)',
        Accept: 'application/json',
      },
      // lekkie cachowanie po stronie Vercel/Next (opcjonalnie)
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }

    const raw: NominatimResponseItem[] = await res.json();
    const items = raw.map((r) => ({
      id: r.place_id,
      label: r.display_name as string,
      lat: Number(r.lat),
      lng: Number(r.lon),
      type: r.type as string | undefined,
      class: r.class as string | undefined,
      // przyda się dla dopasowania widoku mapy, jeśli chcesz:
      bbox: r.boundingbox
        ? {
            south: Number(r.boundingbox[0]),
            north: Number(r.boundingbox[1]),
            west: Number(r.boundingbox[2]),
            east: Number(r.boundingbox[3]),
          }
        : undefined,
    }));

    return NextResponse.json({ items });
  } catch (_err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
