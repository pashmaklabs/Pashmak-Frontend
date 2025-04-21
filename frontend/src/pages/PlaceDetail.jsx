import React from "react";
import { memo } from "react";
import PlaceInfoContainer from "../components/PlaceInfoContainer";

const PlaceDetail = ({ expendSearch, setExpendSearch, hasSearch }) => {
  return (
    <>
      <div
        dir="rtl"
        className={`absolute bg-white bottom-2  shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans ${
          expendSearch ? "right-1/4 h-[80%] rounded-xl" : "right-16 h-screen top-0 "
        } w-[350px] z-[1000] transition-all duration-300`}
      >
        <PlaceInfoContainer hasSearch={hasSearch} />
      </div>

      {hasSearch && expendSearch && (
        <button
          className="absolute right-5 top-1/3 z-[1000] pointer-events-auto"
          onClick={() => setExpendSearch(false)}
        > 
          این دکمه حالت سرچ جمع میکنه
        </button>
      )}
      {hasSearch && !expendSearch && (
        <button
          className="absolute right-5 top-1/3 z-[1000] pointer-events-auto"
          onClick={() => setExpendSearch(true)}
        >
          این دکمه حالت سرچ میاره دوباره
        </button>
      )}
      {!hasSearch && (
        <button className="absolute right-5 top-1/3 z-[1000] pointer-events-auto">
          این حالت وقتی که سرچ برا بازگشت وجود نداره
        </button>
      )}
    </>
  );
};

export default memo(PlaceDetail);
