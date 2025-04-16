import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "font-awesome/css/font-awesome.min.css";
import { useFocus } from "../stores/map";
const MapView = ({ staticPoints, userLocation }) => {
  const defaultCenter = [35.6892, 51.389];
  const defaultZoom = 13;
  const { focus, setFocus } = useFocus();
  const mapCenterRef = useRef(defaultCenter);
  const zoomLevelRef = useRef(defaultZoom);

  const [points, setPoints] = useState([]);

  const fetchPoints = async (lat, lon, zoom) => {
    const MIN_ZOOM_LEVEL = 17;
    if (zoom < MIN_ZOOM_LEVEL) {
      setPoints([]);
      return;
    }

    try {
      const query = `
        [out:json][timeout:25];
        (
          node(around:500,${lat},${lon})[name];
        );
        out body;
      `;

      const url = "https://overpass-api.de/api/interpreter";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();
      const formattedPoints = data.elements
        .filter((item) => item.lat && item.lon)
        .map((item) => ({
          id: item.id,
          name: item.tags?.name || "Unnamed Location",
          type: item.tags?.amenity || item.tags?.shop || "default",
          lat: item.lat,
          lon: item.lon,
        }));

      setPoints(formattedPoints);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const MapEventHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleMoveEnd = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();

        mapCenterRef.current = [center.lat, center.lng];
        zoomLevelRef.current = zoom;

        fetchPoints(center.lat, center.lng, zoom);
      };

      map.on("moveend", handleMoveEnd);
      return () => {
        map.off("moveend", handleMoveEnd);
      };
    }, [map]);

    return null;
  };

  const MapFocus = ({ location }) => {
    const map = useMap();

    useEffect(() => {
      setFocus(false)
      if (location) map.setView(location, 20);
    }, [location,map]);
    return null;
  };

  const FixedSizeCircle = ({ location }) => {
    if (!location) return null;

    const icon = new L.DivIcon({
      className: "fixed-circle",
      html: `
        <div class="relative w-5 h-5 bg-blue-500 border-[1.5px] border-white rounded-full opacity-100 shadow-[0_0_10px_rgba(66,133,244,0.5)]"></div>
        <div class="absolute top-[-7px] left-[-7px] w-[34px] h-[34px] bg-blue-500/20 rounded-full"></div>
      `,
      iconSize: [20, 20],
    });

    return <Marker position={location} icon={icon} />;
  };

  const Shet = ({ userLocation }) => {
    const map = useMap();
    const a = false;
    return (
      <>
        {focus && <MapFocus location={userLocation} map={map} />}
        <FixedSizeCircle location={userLocation} />
        <MapEventHandler map={map} />
      </>
    );
  };
  

  const createCustomIcon = (type) => {
    
    const iconClass = {
      restaurant: "fa-cutlery",
      cafe: "fa-coffee",
      park: "fa-tree",
      hotel: "fa-bed",
      museum: "fa-university",
    }[type] || "fa-map-marker";
    
    return new L.DivIcon({
      className: "custom-icon-wrapper",
      html: `<div class="custom-icon"><i class="fa ${iconClass}" style="font-size: 24px; color: blue;"></i></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full z-20"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />


        {/* {userLocation && (
          <>
            <MapFocus location={userLocation} />
            <FixedSizeCircle location={userLocation} />
          </>
        )}

        <MapEventHandler /> */}

        <Shet userLocation={userLocation}/>

        {staticPoints.map((point) => (
          <Marker
            key={`static-${point.id}`}
            position={[point.lat, point.lon]}
          >
            <Popup>
              <h3>{point.name}</h3>
              <p>ID: {point.id}</p>
              <p>Lat: {point.lat.toFixed(4)}</p>
              <p>Lon: {point.lon.toFixed(4)}</p>
            </Popup>
          </Marker>
        ))}

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lon]}
            icon={createCustomIcon(point.type)}
            
          >
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
