import React from "react";
import { memo } from "react";
import PlaceInfoContainer from "../components/PlaceInfoContainer";

const PlaceDetail = ({ expendSearch, setExpendSearch, hasSearch }) => {
  return (
    <div
      dir="rtl"
      className={`absolute bg-white   shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans ${
        expendSearch
          ? "right-[475px] h-[80%] rounded-xl w-[350px] bottom-8"
          : " w-[400px] right-16 h-[100%] bottom-0 "
      }  transition-all duration-500`}
    >
      <PlaceInfoContainer
        hasSearch={hasSearch}
        setExpendSearch={setExpendSearch}
        expendSearch={expendSearch}
      />
    </div>
  );
};

export default memo(PlaceDetail);
