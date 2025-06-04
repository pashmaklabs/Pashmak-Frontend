import { toast } from "react-toastify";

/**
 * Handles geolocation to get the user's current location.
 * @param {Function} onSuccess - Callback function to handle success. Receives { latitude, longitude }.
 * @param {Function} onError - Optional callback function to handle errors.
 */
const handleLocate = (onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess({ latitude, longitude });
      },
      (error) => {
        toast.error("موقعیت یافت نشد");
        if (onError) {
          onError(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 15000,
      },
    );
  } else {
    toast.error("موقعیت یافت نشد");
    if (onError) {
      onError(new Error("Geolocation is not supported by this browser."));
    }
  }
};

export default handleLocate;
