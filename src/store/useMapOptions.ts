'use client';

import { create } from 'zustand';

/* =========================
 * Types
 * =======================*/

export type LatLng = { lat: number; lng: number };

export type Endpoint = {
  method: 'search' | 'pin';
  query: string;
  coords?: LatLng;
  awaitingClick: boolean;
};

export type MapOptions = {
  zoomLevel: number;
  start: Endpoint;
  end: Endpoint;
};

export type GeocodeItem = {
  id: number | string;
  label: string;
  lat: number;
  lng: number;
  bbox?: { south: number; north: number; west: number; east: number };
  type?: string;
  class?: string;
};

type SearchState = {
  query: string;
  results: GeocodeItem[];
  loading: boolean;
  error: string | null;
};

type Which = 'start' | 'end';

type MapStore = {
  options: MapOptions;
  search: { start: SearchState; end: SearchState };

  // options actions
  setOption: <K extends keyof MapOptions>(key: K, value: MapOptions[K]) => void;
  setStart: <K extends keyof Endpoint>(key: K, value: Endpoint[K]) => void;
  setEnd: <K extends keyof Endpoint>(key: K, value: Endpoint[K]) => void;
  setCoords: (coords: LatLng | undefined) => void;

  // search actions (per which)
  setQuery: (which: Which, q: string) => void;
  geocode: (which: Which) => Promise<void>;
  pickResult: (which: Which, item: GeocodeItem) => void;
  cancelAutoGeocode: (which?: Which) => void;
  setAutoDelay: (ms: number) => void;
};

/* =========================
 * Helpers
 * =======================*/

const isWhich = (x: unknown): x is Which => x === 'start' || x === 'end';

/* =========================
 * Initial state
 * =======================*/

const initial: MapOptions = {
  zoomLevel: 12,
  start: { method: 'search', query: '', coords: undefined, awaitingClick: false },
  end: { method: 'search', query: '', coords: undefined, awaitingClick: false },
};

/* =========================
 * Per-endpoint runtime holders
 * =======================*/

const debounceId: Partial<Record<Which, ReturnType<typeof setTimeout>>> = {};
const abortCtrl: Partial<Record<Which, AbortController>> = {};
const lastFetchedQuery: Record<Which, string> = { start: '', end: '' };
let autoDelay = 500; // ms

/* =========================
 * Store
 * =======================*/

export const useMapOptions = create<MapStore>()((set, get) => ({
  options: initial,
  search: {
    start: { query: '', results: [], loading: false, error: null },
    end: { query: '', results: [], loading: false, error: null },
  },

  /* ---------- Options ---------- */

  setOption: (key, value) => set((s) => ({ options: { ...s.options, [key]: value } }), false),

  setStart: (key, value) =>
    set((s) => ({ options: { ...s.options, start: { ...s.options.start, [key]: value } } }), false),

  setEnd: (key, value) => set((s) => ({ options: { ...s.options, end: { ...s.options.end, [key]: value } } }), false),

  // Ustawia coords na tym endpoint’cie, który „czeka na klik” lub jest w trybie 'pin'
  setCoords: (coords) =>
    set((s) => {
      const { start, end } = s.options;

      if (start.awaitingClick) {
        return { options: { ...s.options, start: { ...start, coords, awaitingClick: false } } };
      }
      if (end.awaitingClick) {
        return { options: { ...s.options, end: { ...end, coords, awaitingClick: false } } };
      }
      if (start.method === 'pin') {
        return { options: { ...s.options, start: { ...start, coords } } };
      }
      if (end.method === 'pin') {
        return { options: { ...s.options, end: { ...end, coords } } };
      }
      // fallback: start
      return { options: { ...s.options, start: { ...start, coords } } };
    }, false),

  /* ---------- Search (per which) ---------- */

  setQuery: (which, q) => {
    if (!isWhich(which)) return;

    // ustal query
    set(
      (s) => ({
        search: {
          ...s.search,
          [which]: { ...s.search[which], query: q },
        },
      }),
      false,
    );

    // auto-geocode tylko dla sekcji w trybie 'search'
    const { options } = get();
    const section = options?.[which];
    if (!section || section.method !== 'search') return;

    // reset debounce
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

    // cancel scheduled debounce
    if (debounceId[which]) {
      clearTimeout(debounceId[which]!);
      delete debounceId[which];
    }

    const q = get().search[which]?.query?.trim?.() ?? '';
    if (q.length < 3) return;
    if (q === lastFetchedQuery[which]) return; // nie duplikuj zapytań

    // cancel previous fetch
    abortCtrl[which]?.abort();
    abortCtrl[which] = new AbortController();

    set(
      (s) => ({
        search: {
          ...s.search,
          [which]: { ...s.search[which], loading: true, error: null, results: [] },
        },
      }),
      false,
    );

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, {
        signal: abortCtrl[which]!.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data: { items: GeocodeItem[] } = await res.json();

      lastFetchedQuery[which] = q;
      set(
        (s) => ({
          search: {
            ...s.search,
            [which]: { ...s.search[which], results: data.items ?? [], loading: false },
          },
        }),
        false,
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      set(
        (s) => ({
          search: {
            ...s.search,
            [which]: { ...s.search[which], loading: false, error: 'Błąd wyszukiwania' },
          },
        }),
        false,
      );
    }
  },

  pickResult: (which, item) => {
    if (!isWhich(which)) return;

    lastFetchedQuery[which] = item.label;

    set(
      (s) => ({
        options: {
          ...s.options,
          [which]: {
            ...s.options[which],
            method: 'search',
            query: item.label,
            coords: { lat: item.lat, lng: item.lng },
            awaitingClick: false,
          },
        },
        search: {
          ...s.search,
          [which]: { ...s.search[which], results: [] },
        },
      }),
      false,
    );

    // cleanup
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
}));
