import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import ApiService, { Route } from '../services/api';
import { type RouteOptionsStore } from './routeOptionsSlice';

export interface generationState {
  isGenerating: boolean;
  results: Route[];
  error?: string | null;
  animationSpeed: number;
  skipAnimation: number;
  animationEnabled: boolean;
}

export interface generationActions {
  getResult: () => Promise<void>;
  setAnimationSpeed: (speed: number) => void;
  triggerSkipAnimation: () => void;
  setAnimationEnabled: (enabled: boolean) => void;
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
  animationSpeed: 500,
  skipAnimation: 0,
  animationEnabled: true,

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

      const result = await ApiService.get({
        algorithm,
        start: start.coords || null,
        end: end.coords || null,
        distance: distance * 1000,
        preferNew,
        startBbox: start.boundingbox,
        endBbox: end.boundingbox,
      });

      set(
        produce((s: GenerationStore & RouteOptionsStore) => {
          s.results.push(result);
          s.isGenerating = false;
          s.skipAnimation = 0;
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

  setAnimationSpeed: (speed: number) => {
    set(
      produce((s: GenerationStore) => {
        s.animationSpeed = speed;
      }),
      false,
      'generation/setAnimationSpeed',
    );
  },

  triggerSkipAnimation: () => {
    set(
      produce((s: GenerationStore) => {
        s.skipAnimation++;
      }),
      false,
      'generation/triggerSkipAnimation',
    );
  },

  setAnimationEnabled: (enabled: boolean) => {
    set(
      produce((s: GenerationStore) => {
        s.animationEnabled = enabled;
        if (enabled) s.skipAnimation = 0;
      }),
      false,
      'generation/setAnimationEnabled',
    );
  },
});
