import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "font-awesome/css/font-awesome.min.css";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import MapControlsStyle from "./MapControls";
import MapMarkers from "./MapStaticPoints";
import UserLocationMarker from "./UserLocationMarker";
import { fetchPoints } from "../utils/fetchPoints";
import useIsMobile from "../hooks/useIsMobile";
import { typeToIconMapping, iconMapping } from "../utils/iconUtils";
import MapRoute from "./MapRoute";
import { createRedPinMarker, addMarkerToMap } from "../utils/customMapElements";
import RandomPointSelect from "./RandomPointSelect";

maplibregl.setRTLTextPlugin(
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
  null,
  true,
);

const MapView = ({ staticPoints, userLocation, onPointClick }) => {
  const [mapReady, setMapReady] = useState(false);
  const maptilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const defaultCenter = [51.389, 35.6892]; // [lng, lat]
  const defaultZoom = 13;
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlaceRef = useRef(null);

  const location = useLocation();
  const isMobile = useIsMobile();

  const decodeParams = () => {
    const hash = window.location.hash;

    if (hash.startsWith("#c")) {
      const [lat, lng, zoom] = hash
        .slice(2)
        .split("-")
        .map((part) => part.replace(/[a-z]/g, ""));
      // console.log("Decoded Params:", { lat, lng, zoom });
      return {
        initialCenter: [parseFloat(lng), parseFloat(lat)],
        initialZoom: parseFloat(zoom),
      };
    }

    return {
      initialCenter: defaultCenter,
      initialZoom: defaultZoom,
    };
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { initialCenter, initialZoom } = decodeParams();

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
      "bottom-left",
    );
    const attributionControl = document.querySelector(
      ".maplibregl-ctrl-attrib",
    );
    if (attributionControl) {
      attributionControl.classList.add("custom-attribution");
    }

    return () => {
      map.remove();
    };
  }, []);

  // Fit bounds on search page
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !staticPoints || staticPoints.length === 0) return;
    if (
      location.pathname === routes.search ||
      location.pathname == routes.bookmarks
    ) {
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

      const markerElement = createRedPinMarker();
      const marker = addMarkerToMap(map, [lng, lat], markerElement);

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

  // map load event to add layers and sources
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let onMoveEnd, onClick, removeLayerAndSource;

    const setupLayer = async () => {
      if (!map.hasImage("material-icon")) {
        for (const [type, icon] of Object.entries(iconMapping)) {
          const image = new Image();
          image.src = icon;
          await new Promise((resolve) => (image.onload = resolve));
          map.addImage(type, image);
        }
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
            "icon-size": 0.3,
            "icon-allow-overlap": true,
            "text-field": ["get", "name"],
            "text-font": ["Open Sans", "Arial Unicode MS"],
            "text-size": 10,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
          },
          paint: {
            "text-color": ["get", "iconColor"],
            "text-halo-color": "white",
            "text-halo-width": 1,
            "text-halo-blur": 0.5,
          },
          minzoom: 15,
        });
      }

      onClick = (e) => {
        const feature = e.features[0];
        const { id } = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        onPointClick({ id, lat, lng: lon });

        if (selectedPlaceRef.current) {
          selectedPlaceRef.current.remove();
        }

        map.flyTo({
          center: [lon, lat],
          zoom: 16,
          essential: true,
          duration: 2000,
        });
      };
      map.on("click", "points-layer", onClick);

      onMoveEnd = async () => {
        const source = map.getSource("points");
        const zoom = map.getZoom();
        const center = map.getCenter();

        if (!source) return;

        const currentParams = new URLSearchParams(window.location.search); // searchParams are not updated inside useEffect so window.location.search is used
        const encodedParams = `#c${center.lat.toFixed(6)}-${center.lng.toFixed(6)}-${zoom.toFixed(2)}z-0p`;
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?${currentParams.toString()}${encodedParams}`,
        ); //prevents map rerendering

        if (zoom >= 15) {
          const data = await fetchPoints(map.getBounds());
          // //-----------------log---------------------------
          // const pointTypes = new Set();
          // data.features.forEach(point => pointTypes.add(point.properties.type));
          // console.log('point types:', Array.from(pointTypes));
          // //-----------------------------------------------
          data.features.forEach((feature) => {
            const type = feature.properties.type;
            feature.properties.icon = iconMapping[type] ? type : "default"; // Ensure the type matches the iconMapping keys
            feature.properties.name =
              feature.properties.name || "Unknown Place";
            const backgroundColor =
              typeToIconMapping[type]?.color || typeToIconMapping.default.color; // Use default color if type not found
            feature.properties.iconColor = backgroundColor || "#000000"; // Default to black if no color is found
          });

          source.setData(data);
        } else {
          source.setData({ type: "FeatureCollection", features: [] });
        }
      };
      map.on("moveend", onMoveEnd);

      map.on("mouseenter", "points-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "points-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      // Initial fetch
      onMoveEnd();
      setMapReady(true);

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
      {location.pathname === routes.dir && (
        <MapRoute map={mapRef.current} mapReady={mapReady} />
      )}
      <UserLocationMarker map={mapRef.current} userLocation={userLocation} />
      {location.pathname === routes.map && mapRef.current && (
        <RandomPointSelect
          map={mapRef.current}
          selectedPlaceRef={selectedPlaceRef}
        />
      )}
    </>
  );
};

export default MapView;
