import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import "leaflet/dist/leaflet.css";

const MapView = ({ onLocationFound, points }) => {
  const defaultCenter = [35.6892, 51.389];
  const defaultZoom = 13;

  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocationMarker onLocationFound={onLocationFound} />

        {points.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lon]}>
            <Popup>
              <h3>{point.name}</h3>
              <p>Lat: {point.lat.toFixed(4)}</p>
              <p>Lon: {point.lon.toFixed(4)}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
