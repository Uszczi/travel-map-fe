import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import ApiService, { Route } from '../services/api';
import { type RouteOptionsStore } from './routeOptionsSlice';

export interface generationState {
  isGenerating: boolean;
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
  isGenerating: false,
  results: [] as Route[],

  getResult: async () => {
    let started = false;
    set(
      produce((s: GenerationStore & RouteOptionsStore) => {
        if (s.isGenerating) return;
        s.isGenerating = true;
        s.error = null;
        started = true;
      }),
      false,
      'generation/getResult/start',
    );
    if (!started) return;

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
          s.isGenerating = false;
        }),
        false,
        'generation/getResult/success',
      );
    } catch (_e) {
      set(
        produce((s: GenerationStore & RouteOptionsStore) => {
          s.error = 'Nie udało się wygenerować trasy';
          s.isGenerating = false;
        }),
        false,
        'generation/getResult/error',
      );
    }
  },
});
