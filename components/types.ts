export type Algorithm = 'dfs' | 'astar' | 'random';

export type LatLng = { lat: number; lng: number };

export type MapOptions = {
  start: {
    method: 'search' | 'pin';
    query: string;
    coords?: LatLng;
    awaitingClick?: boolean;
  };
};
