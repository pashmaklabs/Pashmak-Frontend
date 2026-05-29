import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BookmarksPanel from "./BookmarksPanel";
import routes from "../routes/Routes";
import BookmarkGroupDetails from "./BookmarkGroupDetails";
import useIsMobile from "../hooks/useIsMobile";

const BookmakrsContainer = ({
  expendBookmarksList,
  setexpendBookmarksList,
  setBookmarksLocationsPoints,
}) => {
  const [state, setState] = useState("bookmarksGroupsList");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleBookmarksPanel = () => {
    setexpendBookmarksList(!expendBookmarksList);
  };

  const closeBookmarksPanel = () => {
    navigate(routes.map);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleBookmarksPanel}
        className={`absolute shadow-md w-9 h-9 top-12 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[13] hover:border-0
          ${isMobile ? (expendBookmarksList ? "right-[calc(100vw-36px)] shadow-lg rotate-0" : "right-[20px] rotate-180") : expendBookmarksList ? "right-[480px] rotate-0" : "right-[100px] rotate-180"}`}
        aria-label="Collapse search results"
      >
        <img
          src="/arrow_right.svg"
          className={`h-6 w-6 ${expendBookmarksList ? "-mt-[15%]" : "-mt-[10%]"}`}
          alt="Collapse"
        />
      </button>

      {/*bookmark panel close button*/}
      <button
        onClick={closeBookmarksPanel}
        className={`absolute shadow-md w-9 h-9 top-2 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[13] border-0
          ${isMobile ? (expendBookmarksList ? "right-[calc(100vw-36px)] shadow-lg" : "right-[20px]") : expendBookmarksList ? "sm:right-[480px]" : "sm:right-[100px]"}`}
        aria-label="Collapse search results"
      >
        <img src="/Close_round.svg" alt="Close_round" className="scale-125" />
      </button>

      {/* Main panel */}
      <div
        className={` absolute bg-white shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans 
          sm:right-[77px] sm:top-2 sm:bottom-[var(--promptbar-height)] right-0 bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width))] sm:h-auto h-min-[calc(100vh-200px)]
        transition-all duration-500
        ${expendBookmarksList ? "sm:w-[400px] w-full bg-white" : "w-4 sm:w-4 bg-zinc-100"} ${isMobile ? "z-[12]" : "z-[50]"}`}
        dir="rtl"
        style={{
          backgroundColor: expendBookmarksList ? "#ffffff" : "#F3F3F4",
          borderRadius: "10px",
          // boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {expendBookmarksList && (
          <div className="h-full flex flex-col">
            {state === "bookmarksGroupsList" && (
              <BookmarksPanel
                setState={setState}
                setSelectedGroup={setSelectedGroup}
              />
            )}
            {state === "selectedGroupPanel" && (
              <BookmarkGroupDetails
                setState={setState}
                selectedGroup={selectedGroup}
                setBookmarksLocationsPoints={setBookmarksLocationsPoints}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

BookmakrsContainer.propTypes = {
  setExpendSearch: PropTypes.func.isRequired,
  expendSearch: PropTypes.bool.isRequired,
};

export default BookmakrsContainer;
