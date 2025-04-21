import React, { useState } from "react";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

const PlaceInfoContainer = ({ imageUrl, name, rating, reviews, address, weeklySchedule, phone, links, hasSearch }) => {
  // Default values
  imageUrl = "/resturant.jpg";
  name = "نام رستوران";
  rating = 2.5;
  reviews = 120;
  address = "آدرس رستوران";
  phone = "شماره تماس: 1234567890";
  links = "https://example.com";

  const [activeTab, setActiveTab] = useState("اطلاعات کلی");
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  const tabs = ["اطلاعات کلی", "نظرات", "تصاویر"];

  // Weekly schedule
  weeklySchedule = {
    شنبه: "10:00 - 22:00",
    یکشنبه: "10:00 - 22:00",
    دوشنبه: "10:00 - 22:00",
    سه‌شنبه: "10:00 - 22:00",
    چهارشنبه: "10:00 - 22:00",
    پنج‌شنبه: "10:00 - 22:00",
    جمعه: "10:00 - 22:00",
  };

  // Get today's schedule
  const today = new Date();
  const daysOfWeek = Object.keys(weeklySchedule);
  const todayIndex = (today.getDay() + 6) % 7;
  const todayName = daysOfWeek[todayIndex];
  const todayHours = weeklySchedule[todayName];

  // Determine if the restaurant is open
  const isOpen = (() => {
    const [start, end] = todayHours.split(" - ").map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    });
    const now = today.getHours() * 60 + today.getMinutes();
    return now >= start && now <= end;
  })();

  
  // Render tabs
  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <button
        key={tab}
        className={`flex-1 py-2 text-center bg-transparent text-xs ${
          activeTab === tab ? "font-bold text-gray-800" : "text-gray-600"
        }`}
        style={{
          outline: "none",
          background: "transparent",
          border: "none",
        }}
        onClick={() => {
          setActiveTab(tab);
          document.getElementById(`section-${index}`).scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        {tab}
      </button>
    ));
  };

  // Render weekly schedule
  const renderWeeklySchedule = () => {
    return Object.entries(weeklySchedule).map(([day, hours], index) => (
      <p
        key={day}
        className={`flex justify-between items-center space-x-2 bg-gray-50 rounded-lg p-2 mt-1 mb-1 ml-10 ${
          index === todayIndex ? "font-bold text-black" : ""
        }`}
      >
        <span>{day}</span>
        <span>{hours}</span>
      </p>
    ));
  };
  const navigate = useNavigate();
  return (
    <>
      {/* Section 1: Image */}
      <div className="h-1/3">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <img
          src="/closeWhiteBg.svg" // Replace with the path to your close icon
          alt="close"
          className="absolute top-1 right-1 w-8 h-8 cursor-pointer"
          onClick={() => {
            if(hasSearch)
              navigate("/map/search");
            else
              navigate("/map"); // Replace with your navigation logic
          }} // Replace with your close logic
        />
      </div>

      {/* Section 2: Name and Rating */}
      <div className="p-4 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-sans-bold text-black">{name}</h2>
        <StarRating rating={rating} reviews={reviews} />
      </div>

      {/* Section 3: Tabs */}
      <div className="relative sticky top-[70px] bg-white z-10 border-b border-gray-300">
        <div className="flex justify-around">{renderTabs()}</div>
        <div
          className="absolute bottom-0 h-[3px] bg-purple-500 transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${-tabs.indexOf(activeTab) * 100}%)`,
          }}
        ></div>
      </div>

      {activeTab === "اطلاعات کلی" && (
        <>
          {/* Section 4: Icons */}
          <div className="flex justify-around py-4 px-10 border-b border-gray-300">
            <img src="/direction.svg" alt="route" className="w-10 h-10" />
            <img src="/save.svg" alt="save" className="w-10 h-10" />
            <img src="/call.svg" alt="call" className="w-10 h-10" />
            <img src="/share.svg" alt="share" className="w-10 h-10" />
          </div>

          {/* Section 5: Address, Time, Phone, Links */}
          <div className="p-4 border-b border-gray-300 text-xs">
            <div className="flex">
              <img src="/Map Point.svg" alt="location" className="w-5 h-5 m-2" />
              <p className="text-xs text-gray-600 mt-2">{address}</p>
            </div>

            <div className="flex justify-between items-center">
              <div
                className="text-gray-600 flex items-center cursor-pointer"
                onClick={() => setIsTimeExpanded(!isTimeExpanded)}
              >
                <img
                  src="/Clock Circle.svg"
                  alt="clock"
                  className="w-5 h-5 m-2"
                />
                {isTimeExpanded
                  ? `${isOpen ? "باز" : "بسته"}`
                  : `${isOpen ? "باز" : "بسته"} - ${todayName}: ${todayHours}`}
              </div>

              <div className="flex items-center">
                <img
                  src="/Round Alt Arrow Down.svg"
                  alt="toggle"
                  className={`w-5 h-5 m-2 transform transition-transform cursor-pointer ${
                    isTimeExpanded ? "rotate-0" : "rotate-180"
                  }`}
                  onClick={() => setIsTimeExpanded(!isTimeExpanded)}
                />
                <img
                  src="/Add Square.svg"
                  alt="link"
                  className="w-5 h-5 m-2"
                />
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                isTimeExpanded ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="mr-7 ml-4 text-xs text-gray-600">
                {renderWeeklySchedule()}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex">
                <img src="/Phone.svg" alt="phone" className="w-5 h-5 m-2" />
                <p className="text-gray-600 mt-2">{phone}</p>
              </div>
              <img src="/Add Square.svg" alt="link" className="w-5 h-5 m-2" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex">
                <img src="/Link.svg" alt="link" className="w-5 h-5 m-2" />
                <p className="text-gray-600 mt-2">
                  <a href={links} className="font-thin text-blue-500">
                    {links}
                  </a>
                </p>
              </div>
              <img src="/Add Square.svg" alt="link" className="w-5 h-5 m-2" />
            </div>
          </div>

          {/* Section 6: Comment Button */}
          <div className="flex flex-col justify-center items-center gap-4 p-4">
            <p className="text-sm text-gray-600">نظر خود را با ما به اشتراک بگذارید</p>
            <button className="w-[100px] py-1 bg-white border border-purple-500 text-purple-500 text-sm rounded-lg focus:outline-none focus:border-purple-500">
              ثبت نظر
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PlaceInfoContainer;