import React from "react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const SearchLocation = ({ setHasdSearch, setExpendSearch }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="absolute right-5 top-1/2 z-[1000] pointer-events-auto"
        onClick={() => {
          setExpendSearch(true);
          navigate("/map/place");
        }}
      >
        این نماینده صفحه سرچ که مثلا با کلیک رو این باید جزیات یک مکان بیاد
      </button>

      <button
        className="absolute right-5 top-2/3 z-[1000] pointer-events-auto"
        onClick={() => {
          setExpendSearch(false);
          navigate("/map");
        }}
      >
        این حکم دکمه برگشت به مپ داره
      </button>
    </div>
  );
};

export default memo(SearchLocation);
