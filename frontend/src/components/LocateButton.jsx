import React from "react";
import { useFocus } from "../stores/map";
import { toast } from "react-toastify";

const LocateButton = ({ setUserLocation }) => {
  const { focus, setFocus } = useFocus();
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setFocus(true);
        },
        (error) => {
          toast.error("موقعیت یافت نشد");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 15000,
        },
      );
    } else {
      toast.error("موقعیت یافت نشد");
    }
  };

  return (
    <div
      className="absolute z-[10] sm:bottom-5 bottom-[var(--sidebar-width)] sm:left-10 left-4 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 group"
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
