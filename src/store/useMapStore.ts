'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type GenerationStore, createGenerationSlice } from './generationSlice';
import { type RouteOptionsStore, createRouteOptionsSlice } from './routeOptionsSlice';

export const useMapStore = create<RouteOptionsStore & GenerationStore>()(
  devtools((...a) => ({
    ...createRouteOptionsSlice(...a),
    ...createGenerationSlice(...a),
  })),
);
