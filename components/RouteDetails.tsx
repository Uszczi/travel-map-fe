import 'leaflet/dist/leaflet.css';
import React from 'react';

import { Route } from './services/api';

type RouteDetilsProps = {
  route: Route;
};

const RouteDetils: React.FC<RouteDetilsProps> = ({ route }) => {
  return (
    <div>
      <p>Ostatnia dodana trasa</p>
      <p>Dystans: {Math.round(route.distance)}m</p>
    </div>
  );
};

export default RouteDetils;
