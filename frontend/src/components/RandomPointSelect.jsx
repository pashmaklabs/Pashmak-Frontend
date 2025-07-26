import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createCircleMarker, addMarkerToMap } from "../utils/customMapElements";
import RandomPlacePopup from "./randomPlacePopup";

export default function RandomPointSelect({ map, selectedPlaceRef }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRandomPlacePopup, setShowRandomPlacePopup] = useState(false);

  useEffect(() => {
    if (selectedPlaceRef) {
      randomPointMarkerRemove(selectedPlaceRef);
    }
    const newParams = new URLSearchParams(searchParams);
    const lat = newParams.get("lat");
    const lng = newParams.get("lng");
    const selectedPoint = `${lat},${lng}`;
    if (lat && lng) {
      const [selectedPointLat, selectedPointLng] = selectedPoint
        .split(",")
        .map(parseFloat);
      const startMarkerElement = createCircleMarker("#0074D9", "8px");
      // selectedPlaceRef.current=startMarkerElement
      console.log("marker put");
      selectedPlaceRef.current = addMarkerToMap(
        map,
        [selectedPointLng, selectedPointLat],
        startMarkerElement,
      );
    }
    // else
    // {
    //   randomPointMarkerRemove(selectedPlaceRef);
    // }
  }, [searchParams]);

  const handleRandomPointClick = (e) => {
    const { lng, lat } = e.lngLat;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lat", lat);
    newParams.set("lng", lng);
    setSearchParams(newParams);
    setShowRandomPlacePopup(true);
  };

  const randomPointMarkerRemove = (markerRef) => {
    if (markerRef.current) {
      markerRef.current.remove();
      console.log("marker pick");
      // setShowRandomPlacePopup(false)
    }
  };
  useEffect(() => {
    const startMarkerRef = { current: null };
    console.log(1);
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["points-layer"],
      });
      if (features.length === 0) {
        handleRandomPointClick(e, startMarkerRef);
      }
    });
    return () => {
      // randomPointMarkerRemove(startMarkerRef);
      map.off("click", handleRandomPointClick);
    };
  }, [map]);

  return (
    <div
      className="absolute top-2 left-[750px]
                w-[200px]"
    >
      {showRandomPlacePopup && (
        <RandomPlacePopup
          selectedPlaceRef={selectedPlaceRef}
          setShowRandomPlacePopup={setShowRandomPlacePopup}
        />
      )}
    </div>
  );
}
