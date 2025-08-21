import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import ApiService, { Route } from '../services/api';
import { type RouteOptionsStore } from './routeOptionsSlice';

export interface generationState {
  loading: boolean;
  results: Route[];
  error?: string | null;
}

export interface generationActions {
  getResult: () => Promise<void>;
}

export interface GenerationStore extends generationState, generationActions {}

export const createGenerationSlice: StateCreator<
  GenerationStore & RouteOptionsStore,
  [['zustand/devtools', never]],
  [],
  GenerationStore
> = (set, get) => ({
  loading: false,
  results: [] as Route[],

  getResult: async () => {
    set(
      produce((s: GenerationStore & RouteOptionsStore) => {
        s.loading = true;
        s.error = null;
      }),
      false,
      'generation/getResult/start',
    );

    try {
      const { start, end, distance, algorithm, preferNew } = get();

      const result = await ApiService.get(
        algorithm,
        start.coords || null,
        end.coords || null,
        distance * 1000,
        preferNew,
      );

      set(
        produce((s: GenerationStore & RouteOptionsStore) => {
          s.results.push(result);
          s.loading = false;
        }),
        false,
        'generation/getResult/success',
      );
    } catch (_e) {
      set(
        produce((s: GenerationStore & RouteOptionsStore) => {
          s.loading = false;
          // TODO set to error
          s.error = 'Nie udało się wygenerować trasy';
        }),
        false,
        'generation/getResult/error',
      );
    }
  },
});
