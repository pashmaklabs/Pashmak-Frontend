import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "font-awesome/css/font-awesome.min.css";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import MapControlsStyle from "./MapControls";
import MapMarkers from "./MapMarkers";
import UserLocationMarker from "./UserLocationMarker";
import { fetchPoints } from "../utils/fetchPoints";
import useIsMobile from "../hooks/useIsMobile";

maplibregl.setRTLTextPlugin(
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
  null,
  true,
);

const MapView = ({ staticPoints, userLocation, onPointClick }) => {
  const maptilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const defaultCenter = [51.389, 35.6892]; // [lng, lat]
  const defaultZoom = 13;
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlaceRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const initialCenter = [
    parseFloat(searchParams.get("lng")) || defaultCenter[0],
    parseFloat(searchParams.get("lat")) || defaultCenter[1],
  ];
  const initialZoom = parseFloat(searchParams.get("zoom")) || defaultZoom;
  const isMobile = useIsMobile();
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${maptilerApiKey}`,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    return () => {
      map.remove();
    };
  }, []);

  // Fit bounds on search page
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !staticPoints || staticPoints.length === 0) return;

    if (location.pathname === routes.search) {
      const bounds = new maplibregl.LngLatBounds();
      staticPoints.forEach((point) => {
        bounds.extend([point.longitude, point.latitude]);
      });

      map.fitBounds(bounds, {
        padding: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 400,
        },
        duration: 1000,
      });
    }
  }, [location.pathname, staticPoints]);

  // Fly to user location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const { latitude, longitude } = userLocation;

    map.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      essential: true,
      duration: 2000,
    });
  }, [userLocation]);

  // Handle selected place marker from URL
  useEffect(() => {
    const id = searchParams.get("id");
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));

    if (!id) {
      if (selectedPlaceRef.current) {
        selectedPlaceRef.current.remove();
      }
    }

    if (id && lat && lng) {
      const map = mapRef.current;

      if (selectedPlaceRef.current) {
        selectedPlaceRef.current.remove();
      }
      const el = document.createElement("img");
      el.src = "/locPin.svg";
      el.style.width = "50px";
      el.style.height = "50px";
      el.style.marginTop = "-25px";
      el.style.cursor = "pointer";

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      selectedPlaceRef.current = marker;

      map.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
        duration: 2000,
        offset: [-300, 0],
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let onMoveEnd, onClick, removeLayerAndSource;

    const setupLayer = async () => {
      // Only add image if not already present
      if (!map.hasImage("cat")) {
        const image = await map.loadImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Blue_circle.png/120px-Blue_circle.png",
        );
        map.addImage("cat", image.data);
      }

      if (!map.getSource("points")) {
        map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }

      if (!map.getLayer("points-layer")) {
        map.addLayer({
          id: "points-layer",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": ["get", "icon"],
            "icon-size": 0.1,
            "icon-allow-overlap": true,
          },
          minzoom: 15,
        });
      }

      // Click handler
      onClick = (e) => {
        const feature = e.features[0];
        const { id } = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        onPointClick({ id, lat, lng: lon });

        if (selectedPlaceRef.current) {
          selectedPlaceRef.current.remove();
        }

        const marker = new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);

        selectedPlaceRef.current = marker;

        map.flyTo({
          center: [lon, lat],
          zoom: 16,
          essential: true,
          duration: 2000,
        });
      };

      map.on("click", "points-layer", onClick);

      // Moveend handler
      onMoveEnd = async () => {
        const source = map.getSource("points");
        const zoom = map.getZoom();
        const center = map.getCenter();

        if (!source) return;

        const currentParams = new URLSearchParams(window.location.search); // searchParams are not updated inside useEffect so window.location.search is used

        currentParams.set("lat", center.lat.toFixed(6));
        currentParams.set("lng", center.lng.toFixed(6));
        currentParams.set("zoom", zoom.toFixed(2));

        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?${currentParams.toString()}`,
        ); //prevents map rerendering

        if (zoom >= 15) {
          const data = await fetchPoints(map.getBounds());
          source.setData(data);
        } else {
          source.setData({ type: "FeatureCollection", features: [] });
        }
      };

      map.on("moveend", onMoveEnd);

      // Initial fetch
      onMoveEnd();

      // Clean up
      // removeLayerAndSource = () => {
      //   if (map.getLayer("points-layer")) map.removeLayer("points-layer");
      //   if (map.getSource("points")) map.removeSource("points");
      //   if (map.hasImage("cat")) map.removeImage("cat");
      //   map.off("moveend", onMoveEnd);
      //   map.off("click", "points-layer", onClick);
      // };
    };

    if (map.loaded()) {
      setupLayer();
    } else {
      map.once("load", setupLayer);
    }

    return () => {
      if (removeLayerAndSource) removeLayerAndSource();
    };
  }, []);

  return (
    <>
      {!isMobile && <MapControlsStyle />}
      <div ref={mapContainerRef} className="h-screen w-screen"></div>
      <MapMarkers map={mapRef.current} staticPoints={staticPoints} />
      <UserLocationMarker map={mapRef.current} userLocation={userLocation} />
    </>
  );
};

export default MapView;
