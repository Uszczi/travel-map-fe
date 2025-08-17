export type LatLng = { lat: number; lng: number };

export type MapOptions = {
  start: {
    method: 'search' | 'pin';
    query: string; // tekst z inputu
    coords?: LatLng; // wynik ustawienia pinezki lub wybranej lokalizacji
    awaitingClick?: boolean; // true = czekamy na kliknięcie w mapę
  };
};
