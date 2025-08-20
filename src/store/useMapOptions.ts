'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { geocodeReverse, geocodeSearch } from '@/src/services/geocode';

export type LatLng = { lat: number; lng: number };

export type GeocodeItem = {
  id: number | string;
  label: string;
  lat: number;
  lng: number;
  bbox?: { south: number; north: number; west: number; east: number };
  type?: string;
  class?: string;
};

export type SearchState = {
  method: 'search' | 'pin';
  coords?: LatLng;
  awaitingClick: boolean;
  query: string;
  results: GeocodeItem[];
  loading: boolean;
  error: string | null;
};

type Which = 'start' | 'end';

type MapStore = {
  start: SearchState;
  end: SearchState;

  setStart: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
  setEnd: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
  setCoords: (coords: LatLng | undefined) => void;

  setQuery: (which: Which, q: string) => void;
  geocode: (which: Which) => Promise<void>;
  pickResult: (which: Which, item: GeocodeItem) => void;
  cancelAutoGeocode: (which?: Which) => void;
  setAutoDelay: (ms: number) => void;
  pinToAddress: (which: Which) => Promise<void>;
};

const isWhich = (x: unknown): x is Which => x === 'start' || x === 'end';

const debounceId: Partial<Record<Which, ReturnType<typeof setTimeout>>> = {};
const abortCtrl: Partial<Record<Which, AbortController>> = {};
const lastFetchedQuery: Record<Which, string> = { start: '', end: '' };
let autoDelay = 300; // ms

export const useMapOptions = create<MapStore>()(
  devtools((set, get) => ({
    start: { method: 'search', awaitingClick: false, query: '', results: [], loading: false, error: null },
    end: { method: 'search', awaitingClick: false, query: '', results: [], loading: false, error: null },

    setStart: (key, value) => set((s) => ({ start: { ...s.start, [key]: value } as SearchState }), false),

    setEnd: (key, value) => set((s) => ({ end: { ...s.end, [key]: value } as SearchState }), false),

    setCoords: (coords?: LatLng) =>
      set((s) => {
        const { start, end } = s;

        if (start.awaitingClick) {
          return {
            start: { ...start, coords, awaitingClick: false, query: coords ? `${coords.lat},${coords.lng}` : '' },
          };
        }
        if (end.awaitingClick) {
          return { end: { ...end, coords, awaitingClick: false, query: coords ? `${coords.lat},${coords.lng}` : '' } };
        }
        if (start.method === 'pin') {
          return { start: { ...start, coords, query: coords ? `${coords.lat},${coords.lng}` : '' } };
        }
        if (end.method === 'pin') {
          return { end: { ...end, coords, query: coords ? `${coords.lat},${coords.lng}` : '' } };
        }
        // fallback: start
        return { start: { ...start, coords, query: coords ? `${coords.lat},${coords.lng}` : '' } };
      }, false),

    setQuery: (which, q) => {
      if (!isWhich(which)) return;

      set(
        (s) => ({
          [which]: { ...s[which], query: q },
        }),
        false,
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
        (s) => ({
          [which]: { ...s[which], loading: true, error: null, results: [] },
        }),
        false,
      );

      try {
        const data = await geocodeSearch(q);

        lastFetchedQuery[which] = q;
        set(
          (s) => ({
            [which]: { ...s[which], results: data.items ?? [], loading: false },
          }),
          false,
        );
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        set(
          (s) => ({
            [which]: { ...s[which], loading: false, error: 'Błąd wyszukiwania' },
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
          [which]: {
            ...s[which],
            method: 'search',
            query: item.label,
            coords: { lat: item.lat, lng: item.lng },
            awaitingClick: false,
            results: [],
          },
        }),
        false,
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
        (s) => ({
          [which]: { ...s[which], loading: true, error: null, results: [] },
        }),
        false,
      );

      try {
        const item = await geocodeReverse(coords.lat, coords.lng);
        const label = item.label;

        lastFetchedQuery[which] = label;

        set(
          (s) => ({
            [which]: {
              ...s[which],
              loading: false,
              error: null,
              query: label,
              coords: { lat: Number(item.lat), lng: Number(item.lng) },
              results: [],
            },
          }),
          false,
        );
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        set(
          (s) => ({
            [which]: { ...s[which], loading: false, error: 'Błąd reverse geokodowania' },
          }),
          false,
        );
      }
    },
  })),
);
