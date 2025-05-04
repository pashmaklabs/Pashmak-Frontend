import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "font-awesome/css/font-awesome.min.css";
import { useFocus } from "../stores/map";
import { useSearchParams } from "react-router-dom";

maplibregl.setRTLTextPlugin(
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
  null,
  true,
);

const MapView = ({ staticPoints, userLocation }) => {
  const defaultCenter = [51.389, 35.6892]; // [lng, lat]
  const defaultZoom = 13;
  const { focus, setFocus } = useFocus();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize map position from search params
  const initialCenter = [
    parseFloat(searchParams.get("lng")) || defaultCenter[0],
    parseFloat(searchParams.get("lat")) || defaultCenter[1],
  ];
  const initialZoom = parseFloat(searchParams.get("zoom")) || defaultZoom;

  const fetchPoints = async (bounds) => {
    const { _ne, _sw } = bounds;
    const bbox = `${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng}`;
    const query = `
        [out:json];
      (
        node["amenity"](bbox);
      );
      out body;`.replace("bbox", bbox);

    const url = "https://overpass-api.de/api/interpreter";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });

    const data = await response.json();
    const features = data.elements
      .filter((item) => item.lat && item.lon)
      .map((item) => {
        const type = item.tags?.amenity || item.tags?.shop || "default";
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.lon, item.lat],
          },
          properties: {
            id: item.id,
            name: item.tags?.name || "Unnamed Location",
            type,
            icon: "cat",
          },
        };
      });

    return {
      type: "FeatureCollection",
      features,
    };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        "https://api.maptiler.com/maps/basic/style.json?key=tEK4qnOFcTz1wVKBpZvq",
      center: initialCenter,
      zoom: initialZoom,
    });
    mapRef.current = map;

    map.on("load", async () => {
      const image = await map.loadImage(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png",
      );
      map.addImage("cat", image.data);

      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

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

      map.on("click", "points-layer", (e) => {
        const feature = e.features[0];
        const { name, type } = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        new maplibregl.Popup({ offset: 10 })
          .setLngLat([lon, lat])
          .setHTML(
            `
            <strong>${name}</strong><br />
            <strong>Type:</strong> ${type}<br />
            <strong>Lat:</strong> ${lat.toFixed(5)}<br />
            <strong>Lon:</strong> ${lon.toFixed(5)}
          `,
          )
          .addTo(map);
      });

      map.on("moveend", async () => {
        const source = map.getSource("points");
        const zoom = map.getZoom();
        if (!source) return;
        if (zoom >= 15) {
          const data = await fetchPoints(map.getBounds());
          source.setData(data);
        } else {
          source.setData({ type: "FeatureCollection", features: [] }); // ⬅ Clear points
        }
      });
    });

    // Update URL search params when the map moves
    map.on("moveend", () => {
      const center = map.getCenter();
      const zoom = map.getZoom();

      setSearchParams({
        lat: center.lat.toFixed(5),
        lng: center.lng.toFixed(5),
        zoom: zoom.toFixed(2),
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !staticPoints || staticPoints.length === 0) return;

    const staticPointMarkers = [];

    staticPoints.forEach((point) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundColor = "blue";
      el.style.borderRadius = "50%";

      const marker = new maplibregl.Marker(el)
        .setLngLat([point.lon, point.lat])
        .addTo(map);

      staticPointMarkers.push(marker);
    });

    const bounds = new maplibregl.LngLatBounds();
    staticPoints.forEach((point) => {
      bounds.extend([point.lon, point.lat]);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        bottom: 200,
        left: 100,
        right: 400,
      },
      maxZoom: 12,
      duration: 1000,
    });

    return () => {
      staticPointMarkers.forEach((marker) => marker.remove());
    };
  }, [staticPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const { latitude, longitude } = userLocation;

    map.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      essential: true,
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const el = document.createElement("div");
    el.className = "fixed-circle";
    el.innerHTML = `
      <div class="relative w-5 h-5 bg-blue-500 border-[1.5px] border-white rounded-full opacity-100 shadow-[0_0_10px_rgba(66,133,244,0.5)]"></div>
      <div class="absolute top-[-7px] left-[-7px] w-[34px] h-[34px] bg-blue-500/20 rounded-full"></div>
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    userMarkerRef.current = marker;
  }, [userLocation]);

  return <div ref={mapContainerRef} className="h-screen w-screen"></div>;
};

export default MapView;
