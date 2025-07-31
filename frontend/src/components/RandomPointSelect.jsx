import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createCircleMarker, addMarkerToMap } from "../utils/customMapElements";
import RandomPlacePopup from "./RandomPlacePopup";
import { useNavigate } from "react-router-dom";

export default function RandomPointSelect({ map }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRandomPlacePopup, setShowRandomPlacePopup] = useState(false);
  let clickFuctionRef = null;
  const startMarkerRef = useRef(null);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleRandomPointClick = (e, startMarkerRef) => {
    if (startMarkerRef) {
      randomPointMarkerRemove(startMarkerRef);
    }
    const { lng, lat } = e.lngLat;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lat", lat);
    newParams.set("lng", lng);
    setSearchParams(newParams);
    const selectedPoint = `${lat},${lng}`;
    if (lat && lng) {
      const [selectedPointLat, selectedPointLng] = selectedPoint
        .split(",")
        .map(parseFloat);
      const startMarkerElement = createCircleMarker("#0074D9", "8px");
      startMarkerRef.current = startMarkerElement;
      startMarkerRef.current = addMarkerToMap(
        map,
        [selectedPointLng, selectedPointLat],
        startMarkerElement,
      );
      map.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 2000,
      });
      setShowRandomPlacePopup(true);
    }
  };

  const randomPointMarkerRemove = (markerRef) => {
    if (markerRef.current) {
      markerRef.current.remove();
      setShowRandomPlacePopup(false);
    }
  };

  useEffect(() => {
    map.on(
      "click",
      (clickFuctionRef = (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["points-layer"],
        });
        if (features.length === 0) {
          handleRandomPointClick(e, startMarkerRef);
        }
      }),
    );

    return () => {
      randomPointMarkerRemove(startMarkerRef);
      map.off("click", clickFuctionRef);
    };
  }, [map]);

  return (
    <div
      className="absolute top-2 left-1/2 ml-[-7rem]
                w-60"
    >
      {showRandomPlacePopup && (
        <RandomPlacePopup
          selectedPlaceRef={startMarkerRef}
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
