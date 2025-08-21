'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type RouteOptionsStore, createRouteOptionsSlice } from './routeOptionsSlice';

export const useMapStore = create<RouteOptionsStore>()(
  devtools((...a) => ({
    ...createRouteOptionsSlice(...a),
  })),
);
