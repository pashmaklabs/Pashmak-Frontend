import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createCircleMarker, addMarkerToMap } from "../utils/customMapElements";
import RandomPlacePopup from "./RandomPlacePopup";
import { useNavigate } from "react-router-dom";

export default function RandomPointSelect({ map, selectedPlaceRef }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRandomPlacePopup, setShowRandomPlacePopup] = useState(false);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
      {showLoginPopup && (
        <div className="z-[50] fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-3xl shadow-lg sm:w-1/3 max-w-[400px] sm:min-w-[200px]">
            <div className="text-right">
              <p className="mb-4 font-bold text-black">ورود به حساب کاربری</p>
              <p className="mb-4 text-gray-500">
                لطفا برای استفاده از این امکان وارد حساب کاربری خود شوید
              </p>
            </div>
            <div className="flex justify-center space-x-10">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="bg-white text-blue-500 px-4 py-2 rounded "
              >
                بعدا
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="bg-white text-blue-500 px-4 py-2 rounded"
              >
                ورود به حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
