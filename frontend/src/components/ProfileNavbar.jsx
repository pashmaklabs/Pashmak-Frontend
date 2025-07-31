import { useEffect, useState } from "react";
import { UserRounded, Gallery, ChatLine, Bookmark } from "solar-icon-set";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";

export default function ProfileNavbar(props) {
  const [lastName, setLastName] = useState(props.user.LastName);
  const [firstName, setFirstName] = useState(props.user.FirstName);
  const [profilePhoto, setProfilePhoto] = useState(props.user.Avatar_url);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    Cookies.remove("role");
    navigate(routes.map);
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClose = () => {
    if (window.innerWidth < 1020) {
      setIsCollapsed(true);
    } else {
      navigate(routes.map);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1020) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigateTab = (tab) => {
    props.setState(tab);
    if (window.innerWidth < 1020) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {isCollapsed ? (
        <>
          <div
            className="absolute h-10 w-10 top-4 right-4 p-2
        bg-gray-200 rounded-full shadow-md hover:bg-gray-300
        transition-colors flex flex-col justify-center items-center
        cursor-pointer z-[12]"
            onClick={toggleNavbar}
          >
            <span className="block w-6 h-[2px] bg-gray-400 mb-1"></span>
            <span className="block w-6 h-[2px] bg-gray-400 mb-1"></span>
            <span className="block w-6 h-[2px] bg-gray-400"></span>
          </div>
          <img
            src="./closeWhiteBg.svg"
            className="absolute top-4 left-4 w-9 h-9 cursor-pointer z-[12]"
            onClick={() => navigate(routes.map)}
          />
        </>
      ) : (
        <div className="absolute right-0 flex flex-col h-full w-[400px] bg-white items-center justify-center shadow-lg shadow-gray-300 z-[12]">
          <div className="relative w-full h-[30%]">
            <span className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-[#45454575] to-[#26262600] to-[30%]" />
            <img
              src={profilePhoto || "./userProfilePlaceHolder.png"}
              alt="profile_picture"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-4 right-4 text-white text-lg font-bold text-right">
              {firstName + " " + lastName}
            </span>
            <img
              src="/closeWhiteBg.svg"
              alt="back"
              className="absolute top-2 right-3 w-10 h-10 cursor-pointer"
              onClick={() => handleClose()}
            />
          </div>
          <div className="flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
                <button
                  className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                          text-right hover:border-white focus:outline-none 
                          ${props.state === "profileInfo" ? "text-purple-500" : "text-gray-900"}`}
                  onClick={() => navigateTab("profileInfo")}
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
                  <span className="bg-purple-500 h-[40px] w-[10px] pr-0 rounded-lg  p-0 mr-2" />
                )}
              </div>

              {/* <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
            <button
              className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "gallery" ? "text-purple-500" : "text-gray-900"}`}
              onClick={() => navigateTab("gallery")}
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
              <span className="bg-purple-500 h-[40px] w-[10px] pr-0 rounded-lg  p-0 mr-2"></span>
            )}
          </div> */}

              <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
                <button
                  className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "myComments" ? "text-purple-500" : "text-gray-900"}`}
                  onClick={() => navigateTab("myComments")}
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
                  <span className="bg-purple-500 h-[40px] w-[10px] pr-0 rounded-lg  p-0 mr-2"></span>
                )}
              </div>
              <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
                <button
                  className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
              text-right hover:border-white focus:outline-none 
              ${props.state === "favoriteLocations" ? "text-purple-500" : "text-gray-900"}`}
                  onClick={() => navigateTab("favoriteLocations")}
                >
                  مکان های مورد علاقه
                </button>
                <div className="mr-[25px] ">
                  <Bookmark
                    size={26}
                    color={`${props.state === "favoriteLocations" ? "#7C3AED" : "#111827"}`}
                    iconStyle="Outline"
                  />
                </div>
                {props.state === "favoriteLocations" && (
                  <span className="bg-purple-500 h-[40px] w-[10px] pr-0 rounded-lg  p-0 mr-2"></span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-100 hover:bg-gray-300 hover:text-white hover:border-gray-300 rounded-none border-2  text-gray-400 py-2   transition-all duration-200"
            >
              خروج از حساب
            </button>
          </div>
        </div>
      )}
    </>
  );
}
