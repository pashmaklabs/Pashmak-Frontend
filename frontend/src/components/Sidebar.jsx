import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserLogin } from "../stores/login";
import routes from "../routes/Routes";
import { isUserLoggedIn } from "../utils/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const hiddenRoutes = ["/profile", "/admin", "/change-password"];
  const allDefinedRoutes = Object.values(routes).filter((r) => r !== "*");

  if (
    hiddenRoutes.includes(location.pathname) ||
    !allDefinedRoutes.includes(location.pathname)
  ) {
    return null;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    if (isUserLoggedIn()) {
      navigate("/profile");
    } else {
      setShowLoginPopup(true);
    }
  };

  return (
    <>
      {(isOpen || showLoginPopup) && (
        <div
          className="fixed inset-0 bg-gray-500/50 z-[20]"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <nav
        dir="rtl"
        className={`
        fixed bg-white shadow-[rgba(0,0,1,0.5)_1px_4px_4px_2px] transition-all duration-300 ease-in-out z-[30]
        bottom-0 left-0 w-full flex flex-row 
        sm:shadow-lg sm:px-0 sm:justify-start sm:top-0 sm:right-0 sm:bottom-auto sm:left-auto sm:h-full sm:w-[380px] sm:flex-col 
        ${isOpen ? "flex-col justify-start h-screen sm:w-[380px] px-2" : " px-10 justify-between h-[70px] sm:w-[70px]"}
      `}
      >
        <button
          onClick={toggleSidebar}
          className="py-4 rounded-none bg-transparent text-gray-400 flex justify-start"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line
              x1="4"
              y1="6"
              x2="20"
              y2="6"
              className={`transition-transform duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-1 -translate-x-1" : ""
              }`}
            />
            <line
              x1="4"
              y1="12"
              x2="20"
              y2="12"
              className={`transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              className={`transition-transform duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-1 -translate-x-1" : ""
              }`}
            />
          </svg>
        </button>
        <NavLink
          to="/profile"
          end
          onClick={(e) => {
            if (!isUserLoggedIn()) {
              e.preventDefault(); // stop navigation
              setShowLoginPopup(true);
            }
          }}
          className={({ isActive }) =>
            `flex justify-start px-4 py-4 sm:hover:bg-slate-300 transition-colors ${
              isActive ? "bg-slate-100" : ""
            }`
          }
        >
          <div className="flex items-center">
            <img src="/profile.svg" alt="profile" className="w-9 h-9" />
            {isOpen && (
              <span
                style={{ animationDelay: "2000ms" }}
                className="mr-3 mb-2 inline-block overflow-hidden whitespace-nowrap text-right"
              >
                پروفایل
              </span>
            )}
          </div>
        </NavLink>
        <NavLink
          to="/map/bookmarks"
          end
          onClick={(e) => {
            if (!isUserLoggedIn()) {
              e.preventDefault(); // stop navigation
              setShowLoginPopup(true);
            }
          }}
          className={({ isActive }) =>
            `flex justify-start  px-4 py-4 sm:hover:bg-slate-300 transition-colors ${
              isActive ? "bg-slate-100" : ""
            }`
          }
        >
          <div className="flex items-center">
            <img src="/Bookmark.svg" alt="saved places" className="w-9 h-9" />
            {isOpen && (
              <span className="mr-3 mb- inline-block overflow-hidden whitespace-nowrap text-right">
                مکان های ذخیره شده
              </span>
            )}
          </div>
        </NavLink>
        <NavLink
          to="/map/search-history"
          end
          onClick={(e) => {
            if (!isUserLoggedIn()) {
              e.preventDefault(); // stop navigation
              setShowLoginPopup(true);
            }
          }}
          className={({ isActive }) =>
            `flex justify-start px-4 py-4 sm:hover:bg-slate-300 transition-colors ${
              isActive ? "bg-slate-100" : ""
            }`
          }
        >
          <div className="flex items-center">
            <img
              src="/History.svg"
              alt="search history"
              className=" w-10 h-10"
            />
            {isOpen && (
              <span className="mr-3 mb-1 inline-block overflow-hidden whitespace-nowrap text-right">
                تاریخچه جستجو
              </span>
            )}
          </div>
        </NavLink>
      </nav>
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

export default Sidebar;
