import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserLogin } from "../stores/login";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { userLogin } = useUserLogin();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const hiddenRoutes = ["/login", "/profile", "/complete-profile", "/change-password"];

  if (hiddenRoutes.includes(location.pathname)) {
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
        className="fixed inset-0 bg-gray-500/50 z-40"
        onClick={toggleSidebar}
        aria-hidden="true"
      />
    )}
    <nav
      className={`fixed top-0 right-0 h-full bg-white text-white transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      } z-50`}
    >
      <button
        onClick={toggleSidebar}
        className="w-full bg-white text-gray-400 py-2 px-4 hover:bg-slate-300 transition-colors flex justify-end"
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
              isOpen ? "rotate-45 translate-y-1" : ""
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
              isOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </svg>
      </button>

      <nav className="mt-4">
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
            {isOpen && 
            <span 
              dir="rtl"
              style={{ animationDelay: '2000ms' }} 
              className="mr-2 inline-block overflow-hidden whitespace-nowrap text-right">
              پروفایل
            </span>
            }
            <img src="/profile.svg" alt="profile" className="mr-0.5 w-7 h-7" />
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
                {isOpen && 
                <span 
                  dir="rtl"
                  className="mr-2 inline-block overflow-hidden whitespace-nowrap text-right">
                  مکان های ذخیره شده
                </span>
                }
                <img
                  src="/Bookmark.svg"
                  alt="saved places"
                  className="w-7 h-7"
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
                {isOpen && 
                <span 
                  dir="rtl"
                  className="mr-2 inline-block overflow-hidden whitespace-nowrap text-right">
                  تاریخچه جستجو
                </span>
                }
                <img
                  src="/History.svg"
                  alt="search history"
                  className=" w-8 h-8"
                />
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </nav>
    {showLoginPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white p-6 rounded-3xl shadow-lg w-1/3 max-w-[400px] min-w-[200px]">
        <div className="text-right">
          <p className="mb-4 font-bold text-black">ورود به حساب کاربری</p>
          <p className="mb-4 text-gray-500">لطفا برای استفاده از این امکان وارد حساب کاربری خود شوید</p>
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
              }
            }
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
