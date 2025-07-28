import React from "react";

export default function FavoriteLocations() {
  return (
    <div
      className="h-full space-y-4 p-0 w-full flex flex-col items-center justify-center
             lg:max-w-[calc(100%-400px)] bg-purple-50 bg-opacity-70 transition duration-300
             overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden relative z-[11]"
    >
      <div
        className="overflow-y-auto w-[60%] h-[100%] min-w-[500px] lg:w-[35%] lg:h-[75%] border-[1px] lg:shadow-lg lg:shadow-gray-300 lg:rounded-3xl rounded-3xl p-4  bg-white scrollbar-hide"
        dir="rtl"
      >
      </div>
    </div>
  );
}
