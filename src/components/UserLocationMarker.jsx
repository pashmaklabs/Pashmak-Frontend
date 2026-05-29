import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  addMarkerToMap,
  createUserLocationMarker,
} from "../utils/customMapElements";

const UserLocationMarker = ({ map, userLocation }) => {
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!map || !userLocation) return;

    const { latitude, longitude } = userLocation;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // const el = document.createElement("div");
    // el.className = "fixed-circle";
    // el.innerHTML = `
    //   <div class="relative w-5 h-5 bg-blue-500 border-[1.5px] border-white rounded-full opacity-100 shadow-[0_0_10px_rgba(66,133,244,0.5)]"></div>
    //   <div class="absolute top-[-7px] left-[-7px] w-[34px] h-[34px] bg-blue-500/20 rounded-full"></div>
    // `;

    // const marker = new maplibregl.Marker({ element: el })
    //   .setLngLat([longitude, latitude])
    //   .addTo(map);
    const markerElement = createUserLocationMarker();
    const marker = addMarkerToMap(map, [longitude, latitude], markerElement);

    userMarkerRef.current = marker;

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
    };
  }, [map, userLocation]);

  return null;
};

export default UserLocationMarker;
