import { NextResponse } from 'next/server';

type NominatimResponseItem = {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  boundingbox?: [string, string, string, string];
};

const NOMINATIM_URL = process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_REVERSE_URL = process.env.NOMINATIM_REVERSE_URL ?? 'https://nominatim.openstreetmap.org/reverse';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  const latParam = searchParams.get('lat')?.trim();
  const lngParam = searchParams.get('lng')?.trim();

  if (q && (latParam || lngParam)) {
    return NextResponse.json(
      { error: 'Użyj albo q (search), albo lat+lng (reverse), nie obu naraz.' },
      { status: 400 },
    );
  }

  if (!q && (!latParam || !lngParam)) {
    return NextResponse.json({ error: 'Podaj q (search) lub lat i lng (reverse).' }, { status: 400 });
  }

  if (q) {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');

    try {
      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'CityTravelApp/1.0 (contact: mateuszpapuga24@gmail.com)',
          Accept: 'application/json',
          'Accept-Language': 'pl,en;q=0.8',
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
      }

      const raw: NominatimResponseItem[] = await res.json();

      const items = raw.map((r) => ({
        id: r.place_id,
        label: r.display_name,
        lat: Number(r.lat),
        lng: Number(r.lon),
        type: r.type,
        class: r.class,
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
    } catch {
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
  }

  if (latParam && lngParam) {
    const lat = Number(latParam);
    const lng = Number(lngParam);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'Parametry lat i lng muszą być liczbami.' }, { status: 400 });
    }

    const url = new URL(NOMINATIM_REVERSE_URL);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lng));
    url.searchParams.set('addressdetails', '1');

    try {
      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'CityTravelApp/1.0 (contact: mateuszpapuga24@gmail.com)',
          Accept: 'application/json',
          'Accept-Language': 'pl,en;q=0.8',
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
      }

      type ResponseType = Partial<NominatimResponseItem> & { error?: string };

      const raw = (await res.json()) as ResponseType;

      if (!raw || (raw as ResponseType).error) {
        return NextResponse.json(
          { error: (raw as ResponseType)?.error ?? 'Nie znaleziono adresu dla tych współrzędnych.' },
          { status: 404 },
        );
      }

      const item: NominatimResponseItem = {
        place_id: raw.place_id as number | string,
        display_name: raw.display_name as string,
        lat: raw.lat as string,
        lon: raw.lon as string,
        type: raw.type,
        class: raw.class,
        boundingbox: raw.boundingbox as [string, string, string, string] | undefined,
      };

      return NextResponse.json(item);
    } catch {
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
  }
}
