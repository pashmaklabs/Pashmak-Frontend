import React from "react";
import { useFocus } from "../stores/map";
const LocateButton = ({ setUserLocation }) => {
  const { focus, setFocus } = useFocus();
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setFocus(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to access your location.");
        },
      );
    } else {
      alert("Your browser does not support geolocation.");
    }
  };

  return (
    <div
      className="absolute z-[10] bottom-5 left-10 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 group"
      onClick={handleLocate}
    >
      <div className="relative">
        <img
          src="/map_wave.svg"
          alt="locate"
          className="w-16 h-16 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default LocateButton;
