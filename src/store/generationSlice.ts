import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import { type RouteOptionsStore } from './routeOptionsSlice';

export interface generationState {
  loading: boolean;
}

export interface generationActions {
  setLoading: (value: boolean) => void;
}

export interface GenerationStore extends generationState, generationActions {}

export const createGenerationSlice: StateCreator<
  GenerationStore & RouteOptionsStore,
  [['zustand/devtools', never]],
  [],
  GenerationStore
> = (set) => ({
  loading: false,

  setLoading(value) {
    set(
      produce((s) => {
        s.loading = value;
      }),
      false,
      'generation/setLoading',
    );
  },
});
