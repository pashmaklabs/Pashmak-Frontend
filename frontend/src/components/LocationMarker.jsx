import React, { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";

const LocationMarker = ({ onLocationFound }) => {
  const [position, setPosition] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      try {
        console.log(lat, lng);
        const response = await axios.get(
          `https://overpass-api.de/api/interpreter?data=[out:json];node(around:50,${lat},${lng})[name];out;`,
        );

        if (response.data.elements.length > 0) {
          const location = response.data.elements[0];
          const info = {
            name: location.tags?.name || "Unnamed Location",
            type:
              location.tags?.amenity ||
              location.tags?.shop ||
              "Point of Interest",
            lat: location.lat,
            lon: location.lon,
          };

          setPosition([location.lat, location.lon]);
          setLocationInfo(info);
          onLocationFound(info);
        } else {
          console.log("No named location found here");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <h3>{locationInfo.name}</h3>
        <p>Type: {locationInfo.type}</p>
        <p>Lat: {locationInfo.lat.toFixed(4)}</p>
        <p>Lon: {locationInfo.lon.toFixed(4)}</p>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
