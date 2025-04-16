import React from "react";
import { memo } from "react";

const PlaceDetail = ({ expendSearch, setExpendSearch, hasSearch }) => {
  return (
    <div>
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
    </div>
  );
};

export default memo(PlaceDetail);
