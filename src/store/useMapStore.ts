'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type GenerationStore, createGenerationSlice } from './generationSlice';
import { type MapStore, createMapSlice } from './mapStore';
import { type RouteOptionsStore, createRouteOptionsSlice } from './routeOptionsSlice';

export const useMapStore = create<RouteOptionsStore & GenerationStore & MapStore>()(
  devtools((...a) => ({
    ...createRouteOptionsSlice(...a),
    ...createGenerationSlice(...a),
    ...createMapSlice(...a),
  })),
);
