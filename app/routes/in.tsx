import { useEffect, useState } from 'react';

export default function Index() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Importuj komponent mapy tylko po stronie klienta
    import("~/components/Map").then((module) => setMapComponent(() => module.default));
  }, []);

  return (
    <div>
      <h1>Mapa Leaflet w Remix</h1>
      {/* Renderuj komponent `Map` tylko po stronie klienta */}
      {MapComponent ? <MapComponent /> : <p>Ładowanie mapy...</p>}
    </div>
  );
}
