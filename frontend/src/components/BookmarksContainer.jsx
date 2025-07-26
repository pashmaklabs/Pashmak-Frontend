import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BookmarksPanel from "./BookmarksPanel";
import routes from "../routes/Routes";
import BookmarkGroupDetails from "./BookmarkGroupDetails";

const BookmakrsContainer = ({
  expendBookmarksList,
  setexpendBookmarksList,
  setBookmarksLocationsPoints,
}) => {
  const [state, setState] = useState("bookmarksGroupsList");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

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
        className={`absolute  shadow-md w-9 h-9
                    top-2 transition-all duration-300
                    ease-in-out p-2 rounded-full 
                    hover:bg-gray-100 bg-white z-[13]
                    border-none
          ${expendBookmarksList ? "sm:right-[480px] left-0 sm:left-auto rotate-0" : "sm:right-[90px] right-[20px] rotate-180"}`}
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
        className={`absolute shadow-md w-9 h-9
                    top-12 transition-all duration-300
                    ease-in-out p-2 rounded-full 
                    hover:bg-gray-100 bg-white z-[13]
                    border-none
          ${expendBookmarksList ? "sm:right-[480px] left-0 sm:left-auto rotate-0" : "sm:right-[90px] right-[20px] rotate-180"}`}
        aria-label="Collapse search results"
      >
        <img
          src="/closeWhiteBg.svg"
          className={`h-6 w-6 ${expendBookmarksList ? "-mt-[15%]" : "-mt-[10%]"}`}
          alt="closeWhiteBg"
        />
      </button>

      {/* Main panel */}
      <div
        className={`font-sans fixed right-[70px]
                    top-0 z-[10] bg-white
                    shadow-lg h-screen transition-all
                    duration-300 ease-in-out ${
                      expendBookmarksList
                        ? "w-[400px]"
                        : "w-4 bg-zinc-100 overflow-hidden"
                    }
        `}
        dir="rtl"
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
