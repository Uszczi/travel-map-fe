import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import { geocodeReverse, geocodeSearch } from '@/src/services/geocode';
import type { GeocodeItem } from '@/src/services/geocode';

export type LatLng = { lat: number; lng: number };

export type SearchState = {
  method: 'search' | 'pin';
  coords?: LatLng;
  awaitingClick: boolean;
  query: string;
  results: GeocodeItem[];
  loading: boolean;
  error: string | null;
};

export type Which = 'start' | 'end';

export interface RouteOptionsState {
  start: SearchState;
  end: SearchState;
}

export interface RouteOptionsActions {
  setStart: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
  setEnd:   <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
  setCoords: (coords: LatLng) => void;

  setQuery: (which: Which, q: string) => void;
  geocode: (which: Which) => Promise<void>;
  pickResult: (which: Which, item: GeocodeItem) => void;
  cancelAutoGeocode: (which?: Which) => void;
  setAutoDelay: (ms: number) => void;
  pinToAddress: (which: Which) => Promise<void>;
}

export interface RouteOptionsStore extends RouteOptionsState, RouteOptionsActions {}

const isWhich = (x: unknown): x is Which => x === 'start' || x === 'end';

const debounceId: Partial<Record<Which, ReturnType<typeof setTimeout>>> = {};
const abortCtrl: Partial<Record<Which, AbortController>> = {};
const lastFetchedQuery: Record<Which, string> = { start: '', end: '' };
let autoDelay = 1500; // ms

export const createRouteOptionsSlice: StateCreator<RouteOptionsStore> = (set, get) => ({
  start: { method: 'search', awaitingClick: false, query: '', results: [], loading: false, error: null },
  end:   { method: 'search', awaitingClick: false, query: '', results: [], loading: false, error: null },

  setStart: (key, value) =>
    set(
      produce<RouteOptionsStore>((s) => {
        s.start[key] = value as any;
      }),
      false,
      `mapOptions/start/set/${String(key)}`,
    ),

  setEnd: (key, value) =>
    set(
      produce<RouteOptionsStore>((s) => {
        s.end[key] = value as any;
      }),
      false,
      `mapOptions/end/set/${String(key)}`,
    ),

  setCoords: (coords) =>
    set(
      produce<RouteOptionsStore>((s) => {
        const toStr = (c?: LatLng) => (c ? `${c.lat},${c.lng}` : '');
        const { start, end } = s;

        if (start.awaitingClick) {
          start.coords = coords;
          start.awaitingClick = false;
          start.query = toStr(coords);
          return;
        }
        if (end.awaitingClick) {
          end.coords = coords;
          end.awaitingClick = false;
          end.query = toStr(coords);
          return;
        }
        if (start.method === 'pin') {
          start.coords = coords;
          start.query = toStr(coords);
          return;
        }
        if (end.method === 'pin') {
          end.coords = coords;
          end.query = toStr(coords);
          return;
        }
        // fallback: start
        start.coords = coords;
        start.query = toStr(coords);
      }),
      false,
      'mapOptions/setCoords',
    ),

  setQuery: (which, q) => {
    if (!isWhich(which)) return;

    set(
      produce<RouteOptionsStore>((s) => {
        s[which].query = q;
      }),
      false,
      `mapOptions/${which}/setQuery`,
    );

    const section = get()[which];
    if (!section || section.method !== 'search') return;

    if (debounceId[which]) {
      clearTimeout(debounceId[which]!);
      delete debounceId[which];
    }

    const trimmed = q.trim();
    if (trimmed.length < 3) return;

    debounceId[which] = setTimeout(() => {
      get().geocode(which);
    }, autoDelay);
  },

  geocode: async (which) => {
    if (!isWhich(which)) return;

    if (debounceId[which]) {
      clearTimeout(debounceId[which]!);
      delete debounceId[which];
    }

    const q = get()[which]?.query?.trim?.() ?? '';
    if (q.length < 3) return;
    if (q === lastFetchedQuery[which]) return;

    abortCtrl[which]?.abort();
    abortCtrl[which] = new AbortController();

    set(
      produce<RouteOptionsStore>((s) => {
        s[which].loading = true;
        s[which].error = null;
        s[which].results = [];
      }),
      false,
      `mapOptions/${which}/geocode/start`,
    );

    try {
      const data = await geocodeSearch(q);

      lastFetchedQuery[which] = q;
      set(
        produce<RouteOptionsStore>((s) => {
          s[which].results = data.items ?? [];
          s[which].loading = false;
        }),
        false,
        `mapOptions/${which}/geocode/success`,
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;

      set(
        produce<RouteOptionsStore>((s) => {
          s[which].loading = false;
          s[which].error = 'Błąd wyszukiwania';
        }),
        false,
        `mapOptions/${which}/geocode/error`,
      );
    }
  },

  pickResult: (which, item) => {
    if (!isWhich(which)) return;

    lastFetchedQuery[which] = item.label;

    set(
      produce<RouteOptionsStore>((s) => {
        const sec = s[which];
        sec.method = 'search';
        sec.query = item.label;
        sec.coords = { lat: item.lat, lng: item.lng };
        sec.awaitingClick = false;
        sec.results = [];
      }),
      false,
      `mapOptions/${which}/pickResult`,
    );

    if (debounceId[which]) {
      clearTimeout(debounceId[which]!);
      delete debounceId[which];
    }
    abortCtrl[which]?.abort();
  },

  cancelAutoGeocode: (which) => {
    const keys: Which[] = isWhich(which) ? [which] : ['start', 'end'];
    for (const k of keys) {
      if (debounceId[k]) {
        clearTimeout(debounceId[k]!);
        delete debounceId[k];
      }
      abortCtrl[k]?.abort();
    }
  },

  setAutoDelay: (ms) => {
    autoDelay = Math.max(0, ms | 0);
  },

  pinToAddress: async (which) => {
    if (!isWhich(which)) return;

    const coords = get()[which]?.coords;
    if (!coords) return;

    if (debounceId[which]) {
      clearTimeout(debounceId[which]!);
      delete debounceId[which];
    }
    abortCtrl[which]?.abort();
    abortCtrl[which] = new AbortController();

    set(
      produce<RouteOptionsStore>((s) => {
        s[which].loading = true;
        s[which].error = null;
        s[which].results = [];
      }),
      false,
      `mapOptions/${which}/pinToAddress/start`,
    );

    try {
      const item = await geocodeReverse(coords.lat, coords.lng);
      const label = item.label;

      lastFetchedQuery[which] = label;

      set(
        produce<RouteOptionsStore>((s) => {
          const sec = s[which];
          sec.loading = false;
          sec.error = null;
          sec.query = label;
          sec.coords = { lat: Number(item.lat), lng: Number(item.lng) };
          sec.results = [];
        }),
        false,
        `mapOptions/${which}/pinToAddress/success`,
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;

      set(
        produce<RouteOptionsStore>((s) => {
          s[which].loading = false;
          s[which].error = 'Błąd reverse geokodowania';
        }),
        false,
        `mapOptions/${which}/pinToAddress/error`,
      );
    }
  },
});
