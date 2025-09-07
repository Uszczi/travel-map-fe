import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import ApiService, { Route } from '@/src/services/api';

export interface VisitedRoutesState {
  display: boolean;
  loading: boolean;
  results: Route[];
  error?: string | null;
}

export interface MapState {
  visitedRoutes: VisitedRoutesState;
}

export interface MapActions {
  toggleDisplay: () => Promise<void>;
}

export interface MapStore extends MapState, MapActions {}

export const createMapSlice: StateCreator<MapStore, [['zustand/devtools', never]], [], MapStore> = (set, get) => ({
  visitedRoutes: {
    display: false,
    loading: false,
    results: [],
    error: null,
  },

  toggleDisplay: async () => {
    const display = get().visitedRoutes.display;

    set(
      produce((s) => {
        s.visitedRoutes.display = !display;
      }),
      false,
      `map/toggleDisplay/${!display}`,
    );
    if (display === true) return;

    set(
      produce((s) => {
        s.visitedRoutes.loading = true;
      }),
      false,
      'map/toggleDisplay/loading/start',
    );

    const result = await ApiService.getVisitedRoutes();
    set(
      produce((s) => {
        s.visitedRoutes.results = result;
        s.visitedRoutes.loading = false;
      }),
      false,
      'map/toggleDisplay/loading/end',
    );
  },
});
