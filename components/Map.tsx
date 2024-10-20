"use client";

import {
  MapContainer,
  TileLayer,
  Rectangle,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import {
  createElementHook,
  createElementObject,
  useLeafletContext,
} from "@react-leaflet/core";

// Rozwiązanie problemu z ikonami markerów w Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function Clear() {
  console.log("Clear");
}

const Map = () => {
  const [displayLastRec, setDisplayLastRec] = useState(false);
  const [data, setData] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [routes, setRoutes] = useState([]);

  const addRandomRoue = async () => {
    const response = await fetch("http://localhost:8000/route/random");
    const result = await response.json();

    setData(result);
    setBounds([
      [result.rec[1], result.rec[0]],
      [result.rec[3], result.rec[2]],
    ]);

    // setRoutes([[result.y, result.x]])
    // setRoutes([result.x, result.y])

    let a = [];
    for (let i = 0; i < result.x.length; i++) {
      a.push([result.y[i], result.x[i]]);
    }
    setRoutes([a]);
  };

  const toggleDisplayLastRec = () => {
    setDisplayLastRec((prev) => !prev);
  };

  useEffect(() => {
    console.log(displayLastRec);
  }, [displayLastRec]);
  useEffect(() => {
    console.log(routes);
    routes.map((item, index) => {
      console.log(item);
    });
  }, [routes]);

  const center = [51.6101241, 19.1999532];

  return (
    <div>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "800px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {displayLastRec && bounds && (
          <Rectangle
            bounds={bounds}
            pathOptions={{ color: "red", fill: false }}
          />
        )}

        {routes.length > 0 &&
          routes.map((item, index) => (
            <Polyline key={index} positions={item} color="red" />
          ))}

      </MapContainer>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <button
          className="w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={Clear}
        >
          Clear
        </button>
        <div className={"flex items-center"}>
          <div
            onClick={toggleDisplayLastRec}
            className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
              displayLastRec ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                displayLastRec ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
          <p>Display last border</p>
        </div>
        <button
          className="w-64 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
          onClick={addRandomRoue}
        >
          Add random route
        </button>
      </div>
    </div>
  );
};

export default Map;
