import "leaflet/dist/leaflet.css";

import { Route } from "./services/api";

import React from 'react';

type RouteDetilsProps = {
  route: Route;
};

const RouteDetils: React.FC<RouteDetilsProps> = ({route}) => {
  return (
    <div>
    <p>Ostatnia dodana trasa</p>
    <p>Dystans: {Math.round(route.distance)}m</p>
    </div>
  );
};

export default RouteDetils
