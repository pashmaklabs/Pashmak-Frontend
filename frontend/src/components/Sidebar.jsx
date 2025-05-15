import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserLogin } from "../stores/login";
import routes from "../routes/Routes";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { userLogin } = useUserLogin();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const hiddenRoutes = ["/profile"];
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
    if (userLogin) {
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
        className={`rounded-none fixed top-0 right-0 h-full bg-white text-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-[380px]" : "w-[70px]"
        } z-[30]`}
      >
        <button
          onClick={toggleSidebar}
          className="w-[70px]  focus:border-transparent border-transparent !outline-none rounded-none bg-white text-gray-400 right-0 transition-colors absolute justify-end"
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

        <div className="mt-14">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/profile"
                end
                onClick={(e) => {
                  if (!userLogin) {
                    e.preventDefault(); // stop navigation
                    setShowLoginPopup(true);
                  }
                }}
                className={({ isActive }) =>
                  `flex justify-end py-2 px-4 hover:bg-slate-300 transition-colors ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
              >
                <div className="flex items-center">
                  {isOpen && (
                    <span
                      dir="rtl"
                      style={{ animationDelay: "2000ms" }}
                      className="mr-3 mb-2 inline-block overflow-hidden whitespace-nowrap text-right"
                    >
                      پروفایل
                    </span>
                  )}
                  <img src="/profile.svg" alt="profile" className="w-9 h-9" />
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/bookmarks"
                end
                onClick={(e) => {
                  if (!userLogin) {
                    e.preventDefault(); // stop navigation
                    setShowLoginPopup(true);
                  }
                }}
                className={({ isActive }) =>
                  `flex justify-end py-2 px-4 hover:bg-slate-300 transition-colors ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
              >
                <div className="flex items-center">
                  {isOpen && (
                    <span
                      dir="rtl"
                      className="mr-3 mb- inline-block overflow-hidden whitespace-nowrap text-right"
                    >
                      مکان های ذخیره شده
                    </span>
                  )}
                  <img
                    src="/Bookmark.svg"
                    alt="saved places"
                    className="w-9 h-9"
                  />
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search-history"
                end
                onClick={(e) => {
                  if (!userLogin) {
                    e.preventDefault(); // stop navigation
                    setShowLoginPopup(true);
                  }
                }}
                className={({ isActive }) =>
                  `flex justify-end py-2 px-4 hover:bg-slate-300 transition-colors ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
              >
                <div className="flex items-center">
                  {isOpen && (
                    <span
                      dir="rtl"
                      className="mr-3 mb-2 inline-block overflow-hidden whitespace-nowrap text-right"
                    >
                      تاریخچه جستجو
                    </span>
                  )}
                  <img
                    src="/History.svg"
                    alt="search history"
                    className=" w-10 h-10"
                  />
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      {showLoginPopup && (
        <div className="z-[50] fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-3xl shadow-lg w-1/3 max-w-[400px] min-w-[200px]">
            <div className="text-right">
              <p className="mb-4 font-bold text-black">ورود به حساب کاربری</p>
              <p className="mb-4 text-gray-500">
                لطفا برای استفاده از این امکان وارد حساب کاربری خود شوید
              </p>
            </div>
            <div className="flex justify-center space-x-10">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
              >
                بعدا
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
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
