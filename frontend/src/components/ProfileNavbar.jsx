import { useEffect, useState } from "react";
import { UserRounded, Gallery, ChatLine, Bookmark } from "solar-icon-set";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";

export default function ProfileNavbar(props) {
  const [lastName, setLastName] = useState(props.user.LastName);
  const [firstName, setFirstName] = useState(props.user.FirstName);
  const [profilePhoto, setProfilePhoto] = useState(props.user.Avatar_url);
  const navigate = useNavigate();

  useEffect(() => {
    setLastName(props.user.LastName);
    setFirstName(props.user.FirstName);
    setProfilePhoto(props.user.Avatar_url);
  }, [props.user]);

  const handleLogout = () => {
    Cookies.remove("pashmak_authentication", {
      path: "/",
      domain: ".darkube.app",
    });
    navigate(routes.map);
  };

  return (
    <div className="flex flex-col h-full w-[30%] bg-white items-center justify-center border-gray-400 border-l-[1px]">
      <div className="relative w-full">
        <span className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-[#45454575] to-[#26262600] to-[30%]" />
        <img
          src={"./profilePhotoPlaceholder.svg"}
          alt="profile_picture"
          className="w-full h-full"
        />
        <span className="absolute bottom-4 right-4 text-white text-lg font-bold text-right">
          {firstName + " " + lastName}
        </span>
        <img
          src="/arrow_right.svg"
          alt="back"
          className="absolute top-3 right-3 w-6 h-6 cursor-pointer"
          onClick={() => navigate(routes.map)}
        />
      </div>
      <div className="flex flex-col justify-between h-full w-full">
        <div>
          <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
            <button
              className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                          text-right hover:border-white focus:outline-none 
                          ${props.state === "profileInfo" ? "text-purple-600" : "text-gray-900"}`}
              onClick={() => props.setState("profileInfo")}
            >
              اطلاعات حساب کاربری
            </button>
            <div className="mr-[25px] mt-2">
              <UserRounded
                size={26}
                color={`${props.state === "profileInfo" ? "#7C3AED" : "#111827"}`}
                iconStyle="Outline"
              />
            </div>
            {props.state === "profileInfo" && (
              <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0" />
            )}
          </div>

          <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
            <button
              className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "gallery" ? "text-purple-600" : "text-gray-900"}`}
              onClick={() => props.setState("gallery")}
            >
              گالری
            </button>
            <div className="mr-[25px] ">
              <Gallery
                size={26}
                color={`${props.state === "gallery" ? "#7C3AED" : "#111827"}`}
                iconStyle="Outline"
              />
            </div>
            {props.state === "gallery" && (
              <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
            )}
          </div>

          <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
            <button
              className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "myComments" ? "text-purple-600" : "text-gray-900"}`}
              onClick={() => props.setState("myComments")}
            >
              نظرات
            </button>
            <div className="mr-[25px] ">
              <ChatLine
                size={26}
                color={`${props.state === "myComments" ? "#7C3AED" : "#111827"}`}
                iconStyle="Outline"
              />
            </div>
            {props.state === "myComments" && (
              <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
            )}
          </div>
          <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
            <button
              className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
              text-right hover:border-white focus:outline-none 
              ${props.state === "favoriteLocations" ? "text-purple-600" : "text-gray-900"}`}
              onClick={() => props.setState("favoriteLocations")}
            >
              مکان های مورد علاقه
            </button>
            <div className="mr-[25px] ">
              <Bookmark size={26} color={"#5DB313"} iconStyle="Outline" />
            </div>
            {props.state === "favoriteLocations" && (
              <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
            )}
          </div>
        </div>

        <div className="flex w-full p-1 pr-1 ">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 hover:border-none rounded-xl transition-all duration-200"
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
