'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createRouteOptionsSlice, type RouteOptionsStore } from './routeOptionsSlice';

export const useMapStore = create<RouteOptionsStore>()(
  devtools((...a) => ({
    ...createRouteOptionsSlice(...a),
  })),
);
