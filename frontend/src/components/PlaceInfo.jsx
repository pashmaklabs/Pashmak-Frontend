import { useState } from "react";
import SharePopup from "./SharePopUp";
import PhoneCall from "./PhoneCall";
import {AddSchedulePopup, AddLinkPopup, AddPhonePopup} from "./PlaceInfoUserSubmit";
import { useUserLogin } from "../stores/login";
import { useNavigate } from "react-router-dom";
import SaveLocationPopup from "./SaveLocationPopup"

const PlaceInfoContainer = ({
  address,
  weeklySchedule,
  phone,
  links,
  handleSubmitCommentButton,
  handleRouteClick,
}) => {
  // Default values
  address = address || "آدرس رستوران";
  phone = phone || "شماره تماس: 1234567890";
  links = links || "https://example.com";

  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  // const [showCommentForm, setShowCommentForm] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [showSaveLocationPopup, setSaveLocationPopup] = useState(false);

  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState("none");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const shareURL = window.location.href;
  const { userLogin } = useUserLogin();
  const navigate = useNavigate();

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

  // Render weekly schedule
  const renderWeeklySchedule = (Schedule) => {
    return Object.entries(Schedule).map(([day, hours], index) => (
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

  const handleAddPopups = (popup) => {
    if (!userLogin) {
      setShowLoginPopup(true);
      return;
    }
    else{
      setIsPopupOpen(popup);
    }
  };

  return (
    <>
      <div className="flex-col items-center justify-center overflow-y-auto  ">
        {/* Section 4: Icons */}
        <div className="flex justify-around py-4 px-10 border-b border-gray-300">
          <img
            src="/direction.svg"
            alt="route"
            className="w-10 h-10 cursor-pointer"
            onClick={() => handleRouteClick()}
          />
          <img
            src="/save.svg"
            alt="save"
            className="w-10 h-10 cursor-pointer"
            onClick={() => setSaveLocationPopup(true)}
          />
          <img
            src="/call.svg"
            alt="call"
            className="w-10 h-10 cursor-pointer"
            onClick={() => setIsCallOpen(true)}
          />
          {isCallOpen && (
            <PhoneCall phone={phone} onClose={() => setIsCallOpen(false)} />
          )}
          <img
            src="/share.svg"
            alt="share"
            className="w-10 h-10 cursor-pointer"
            onClick={() => setIsShareOpen(true)}
          />
        </div>
        {isShareOpen && (
          <SharePopup
            shareUrl={shareURL}
            placeName={name}
            placeAddress={address}
            onClose={() => setIsShareOpen(false)}
          />
        )}
        {showSaveLocationPopup && (
          <SaveLocationPopup setSaveLocationPopup={setSaveLocationPopup} />
        )}

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
                className="w-5 h-5 m-2 cursor-pointer"
                onClick={()=>{handleAddPopups("schedule")}}
              />
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              isTimeExpanded ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="mr-7 ml-4 text-xs text-gray-600">
              {renderWeeklySchedule(weeklySchedule)}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex">
              <img src="/Phone.svg" alt="phone" className="w-5 h-5 m-2" />
              <p className="text-gray-600 mt-2">{phone}</p>
            </div>
            <img src="/Add Square.svg" alt="link" className="w-5 h-5 m-2 cursor-pointer" onClick={()=>{handleAddPopups("phone")}} />
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
            <img src="/Add Square.svg" alt="link" className="w-5 h-5 m-2 cursor-pointer" onClick={()=>{handleAddPopups("link")}} />
          </div>
        </div>

        {/* Section 6: Comment Button */}
        <div className="flex flex-col justify-center items-center gap-4 p-4">
          <p className="text-sm text-gray-600">
            نظر خود را با ما به اشتراک بگذارید
          </p>
          <button
            className="w-[100px] py-1 bg-white border border-purple-500
                                     text-purple-500 text-sm rounded-lg 
                                      focus:outline-none focus:border-purple-500 hover:border-purple-500"
            onClick={handleSubmitCommentButton}
          >
            ثبت نظر
          </button>
        </div>
      </div>

      {isPopupOpen==="schedule" && (
        <AddSchedulePopup
          weeklySchedule={weeklySchedule}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}
      {isPopupOpen==="phone" && (
        <AddPhonePopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}
      {isPopupOpen==="link" && (
        <AddLinkPopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}
      {showLoginPopup && (
        <div className="z-[50] fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-3xl shadow-lg sm:w-1/3 max-w-[400px] sm:min-w-[200px]">
            <div className="text-right">
              <p className="mb-4 font-bold text-black">ورود به حساب کاربری</p>
              <p className="mb-4 text-gray-500">
                لطفا برای استفاده از این امکان وارد حساب کاربری خود شوید
              </p>
            </div>
            <div className="flex justify-center space-x-10">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="bg-white text-blue-500 px-4 py-2 rounded "
              >
                بعدا
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="bg-white text-blue-500 px-4 py-2 rounded"
              >
                ورود به حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceInfoContainer;