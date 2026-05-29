import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useSearchParams } from "react-router-dom";
import { useFocusedInputStore } from "../stores/routing";
import { useGetRequest } from "../services/api";
import {
  createCircleMarker,
  createRedPinMarker,
  addMarkerToMap,
  createPopup,
} from "../utils/customMapElements";
import { toast } from "react-toastify";

const MapRoute = ({ map, mapReady, onLoadingChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { focusedInput, setFocusedInput } = useFocusedInputStore();

  const {
    mutate: getRoute,
    data: routeData,
    isPending: isLoading,
    error,
  } = useGetRequest(); // Use the same structure as in PlaceDetail

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const removeMarker = (markerRef) => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  const removeRoute = (map, popupRef) => {
    if (map.getSource("route")) {
      map.removeLayer("route-layer");
      map.removeSource("route");
    }
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  };

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;

    if (focusedInput === "start") {
      searchParams.set("start", `${lat.toFixed(6)},${lng.toFixed(6)}`);
      setSearchParams(searchParams);
      setFocusedInput("end");
    } else if (focusedInput === "end") {
      searchParams.set("end", `${lat.toFixed(6)},${lng.toFixed(6)}`);
      setSearchParams(searchParams);
      setFocusedInput(null);
    }
  };

  useEffect(() => {
    if (!map || !mapReady) return;

    map.on("click", handleMapClick);

    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const startMarkerRef = { current: null };
    const endMarkerRef = { current: null };
    const popupRef = { current: null };

    // Add start marker
    if (startParam) {
      const [startLat, startLng] = startParam.split(",").map(parseFloat);
      const startMarkerElement = createCircleMarker("#0074D9");
      startMarkerRef.current = addMarkerToMap(
        map,
        [startLng, startLat],
        startMarkerElement,
      );
    } else {
      removeMarker(startMarkerRef);
    }

    // Add end marker
    if (endParam) {
      const [endLat, endLng] = endParam.split(",").map(parseFloat);
      const endMarkerElement = createRedPinMarker();
      endMarkerRef.current = addMarkerToMap(
        map,
        [endLng, endLat],
        endMarkerElement,
      );
    } else {
      removeMarker(endMarkerRef);
    }

    // Fetch and add route if both start and end are specified
    if (startParam && endParam) {
      const [startLat, startLng] = startParam.split(",").map(parseFloat);
      const [endLat, endLng] = endParam.split(",").map(parseFloat);

      getRoute(
        {
          endpoint: "/navigation/route",
          params: {
            start_lat: startLat,
            start_lon: startLng,
            end_lat: endLat,
            end_lon: endLng,
          },
        },
        {
          onSuccess: (data) => {
            if (
              !data ||
              !data.result ||
              !data.result.routes ||
              data.result.routes.length === 0
            ) {
              console.error("Invalid routing response:", data);
              removeRoute(map, popupRef);
              return;
            }

            const routeCoordinates = data.result.routes[0].geometry.coordinates;

            if (map.getSource("route")) {
              map.getSource("route").setData({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
              });
            } else {
              map.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: routeCoordinates,
                  },
                },
              });

              map.addLayer({
                id: "route-layer",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#0074D9",
                  "line-width": 4,
                },
              });
            }

            const bounds = new maplibregl.LngLatBounds();
            routeCoordinates.forEach((coord) => bounds.extend(coord));
            map.fitBounds(bounds, {
              padding: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 500,
              },
            });

            // Add popup with route details
            const duration = data.result.routes[0].duration;
            const distance = data.result.routes[0].distance;
            const middleIndex = Math.floor(routeCoordinates.length / 2);
            const middlePoint = routeCoordinates[middleIndex];

            if (popupRef.current) {
              popupRef.current.remove();
            }
            popupRef.current = createPopup(
              map,
              middlePoint,
              duration,
              distance,
            );
          },
          onError: (error) => {
            toast.error("مسیری پیدا نشد");
            console.error("Error fetching route:", error);
            removeRoute(map, popupRef);
          },
        },
      );
    } else {
      removeRoute(map, popupRef);
    }

    return () => {
      removeMarker(startMarkerRef);
      removeMarker(endMarkerRef);
      removeRoute(map, popupRef);
      map.off("click", handleMapClick);
    };
  }, [map, mapReady, focusedInput, searchParams, setSearchParams, getRoute]);

  return null;
};

export default MapRoute;
