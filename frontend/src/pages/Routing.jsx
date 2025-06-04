import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import routes from "../routes/Routes";
import { useFocusedInputStore, usePrevRouteStore } from "../stores/routing";
import handleLocate from "../utils/handleLocate";

const Routing = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { focusedInput, setFocusedInput } = useFocusedInputStore();
  const clearPreviousRoute = usePrevRouteStore(
    (state) => state.clearPreviousRoute,
  );
  const [userLoc, setUserLoc] = useState(null);

  const previousRoute = usePrevRouteStore((state) => state.previousRoute);

  useEffect(() => {
    setFocusedInput("start");
    const endParam = searchParams.get("end");
    const startParam = searchParams.get("start");
    if (endParam) {
      setEnd(endParam);
    }
    if (startParam) {
      setStart(startParam);
      setFocusedInput(null);
    }
  }, [searchParams]);

  const isValidLatLng = (value) => {
    const regex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    return regex.test(value);
  };

  const handleRoute = (upStart, upEnd) => {
    const newParams = new URLSearchParams(searchParams);

    if (upStart && isValidLatLng(upStart)) {
      newParams.set("start", upStart);
    } else {
      newParams.delete("start");
    }

    if (upEnd && isValidLatLng(upEnd)) {
      newParams.set("end", upEnd);
    } else {
      newParams.delete("end");
    }

    setSearchParams(newParams);
  };

  const handleSwap = () => {
    setStart((prevStart) => {
      setEnd(prevStart);
      return end;
    });
    handleRoute(end, start);
  };

  const handleClose = () => {
    if (previousRoute) {
      navigate({
        pathname: previousRoute.pathname,
        search: previousRoute.search,
      });
    } else {
      navigate(routes.map);
    }

    clearPreviousRoute();
  };

  const handleLocateClick = () => {
    handleLocate(
      (location) => {
        if (focusedInput === "start") {
          setStart(`${location.latitude},${location.longitude}`);
          handleRoute(`${location.latitude},${location.longitude}`, end);
        } else if (focusedInput === "end") {
          setEnd(`${location.latitude},${location.longitude}`);
          handleRoute(start, `${location.latitude},${location.longitude}`);
        }
        setUserLoc(location);
      },
      (error) => {
        console.error("Error locating user:", error);
      },
    );
  };

  return (
    <div
      className=" z-[10] absolute bg-white  text-gray-700 shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans 
           rounded-md sm:right-[calc(var(--sidebar-width)+8px)] sm:top-2 right-0  sm:bottom-0 bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width)-200px)] sm:h-[280px] h-min-[calc(100vh-200px)]
            transition-all duration-500 sm:w-[400px] w-full"
      dir="rtl"
    >
      <img
        src="/closeWhiteBg.svg"
        alt="close"
        className="absolute left-2 mt-4 w-8 h-auto cursor-pointer"
        onClick={handleClose}
      />
      <h2 className="mr-8 text-xl font-bold mt-4">مسیریابی</h2>
      <div className="flex gap-2 mt-10 m-2 p-4">
        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://neshan.org/maps/74153c82e791e1677461.svg"
            alt="Left"
            className="max-w-[80px] max-h-[80px] h-52"
          />
        </div>

        <div className="flex-2 flex flex-col justify-center items-center gap-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={
                focusedInput === "start"
                  ? "برروی نقشه کلیک کنید"
                  : "مبدا را انتخاب کنید"
              }
              value={start}
              onFocus={() => setFocusedInput("start")}
              onChange={(e) => {
                const updatedStart = e.target.value;
                setStart(updatedStart);
                handleRoute(updatedStart, end);
              }}
              className="w-full p-3 border h-10 bg-white border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            {start && (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent !border-transparent"
                onClick={() => {
                  setStart("");
                  handleRoute("", end);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder={
                focusedInput === "end"
                  ? "برروی نقشه کلیک کنید"
                  : "مقصد را انتخاب کنید"
              }
              value={end}
              onFocus={() => setFocusedInput("end")}
              onChange={(e) => {
                const updatedEnd = e.target.value;
                setEnd(updatedEnd);
                handleRoute(start, updatedEnd);
              }}
              className="w-full p-3 border h-10 bg-white border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            {end && (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent !border-transparent"
                onClick={() => {
                  setEnd("");
                  handleRoute(start, "");
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://neshan.org/maps/36690c17e30b8565ea75.svg"
            alt="Right"
            className="max-w-[80px] max-h-[80px] w-9 h-9 cursor-pointer"
            onClick={handleSwap}
          />
        </div>
      </div>
      <div className="mr-5 cursor-pointer" onClick={handleLocateClick}>
        <img
          src="/locate.png"
          alt="locate"
          className="w-4 h-4 inline-block mr-2"
        />
        <span className="text-lg mr-2">لوکیشن من</span>
      </div>
    </div>
  );
};

export default Routing;
