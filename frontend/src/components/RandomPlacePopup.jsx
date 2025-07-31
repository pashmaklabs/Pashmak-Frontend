import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveLocationPopup from "./SaveLocationPopup";
import { X } from "lucide-react";
import AddNewLocationPopup from "./AddNewLocationPopup";
import { usePrevRouteStore } from "../stores/routing";
import routes from "../routes/Routes";
import { isUserLoggedIn } from "../utils/auth";

export default function RandomPlacePopup({
  selectedPlaceRef,
  setShowRandomPlacePopup,
  setShowLoginPopup,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = parseFloat(searchParams.get("lat")).toFixed(6);
  const lng = parseFloat(searchParams.get("lng")).toFixed(6);
  const [showSaveLocationPopup, setShowSaveLocationPopup] = useState(false);
  const [showAddNewLocationPopup, setShowAddNewLocationPopup] = useState(false);
  const setPreviousRoute = usePrevRouteStore((state) => state.setPreviousRoute);
  const navigate = useNavigate();

  const handleCloseButtonClick = () => {
    setShowRandomPlacePopup(false);
    console.log(selectedPlaceRef);
    navigate("/map");
    selectedPlaceRef.current.remove();
  };

  const handleSaveLocationButtonClick = () => {
    if (isUserLoggedIn()) {
      setShowSaveLocationPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleAddNewLocationButtonClick = () => {
    if (isUserLoggedIn()) {
      setShowAddNewLocationPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleRouteClick = () => {
    if (lat && lng) {
      setPreviousRoute({
        pathname: location.pathname,
        search: location.search,
      });

      const endParam = `${lat},${lng}`;
      navigate(`${routes.dir}?end=${endParam}`);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center
                    justify-center w-full h-full
                    p-3 bg-white rounded-lg
                    shadow-md relative"
    >
      {/* clase button */}
      <button
        className="absolute left-0 top-0
          rounded-full p-0
          border-none bg-white"
        onClick={handleCloseButtonClick}
      >
        <img alt="close_button" src="/closeWhiteBg.svg" className="" />
      </button>

      <div className="m-2">
        <span className="text-gray-900" dir="ltr">
          {lat.toString() + ", " + lng.toString()}
        </span>
      </div>

      <div
        className="flex items-center justify-center
                        m-2"
      >
        {/* add location button */}
        <img
          src="/add_location.svg"
          alt="add_location"
          className="w-10 h-10 cursor-pointer ml-1"
          onClick={handleAddNewLocationButtonClick}
        />

        {/* save location button */}
        <img
          src="/save.svg"
          alt="save"
          className="w-10 h-10 cursor-pointer ml-1"
          onClick={handleSaveLocationButtonClick}
        />

        {/* routing button */}
        <img
          src="/direction.svg"
          alt="route"
          className="w-10 h-10 cursor-pointer ml-1"
          onClick={() => handleRouteClick()}
        />
      </div>

      {showSaveLocationPopup && (
        <SaveLocationPopup setSaveLocationPopup={setShowSaveLocationPopup} />
      )}

      {showAddNewLocationPopup && (
        <AddNewLocationPopup
          latitude={parseFloat(lat)}
          longitude={parseFloat(lng)}
          setShowAddNewLocationPopup={setShowAddNewLocationPopup}
        />
      )}
    </div>
  );
}
