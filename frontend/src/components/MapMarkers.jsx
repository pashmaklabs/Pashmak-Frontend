import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useNavigate } from "react-router-dom";

const MapMarkers = ({ map, staticPoints }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!map || !staticPoints || staticPoints.length === 0) return;

    const staticPointMarkers = [];

    staticPoints.forEach((point) => {
      const el = document.createElement("div");
      el.className = "custom-marker cursor-pointer";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundColor = "blue";
      el.style.borderRadius = "50%";

      const marker = new maplibregl.Marker(el)
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        navigate(
          `/map/place?id=${point.osm_id}&lat=${point.latitude}&lng=${point.longitude}`,
        );
      });

      staticPointMarkers.push(marker);
    });

    return () => {
      staticPointMarkers.forEach((marker) => marker.remove());
    };
  }, [map, staticPoints, navigate]);

  return null;
};

export default MapMarkers;
