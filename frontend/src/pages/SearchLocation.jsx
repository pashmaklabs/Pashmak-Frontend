import { memo } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/SearchResults";
import routes from "../routes/Routes";
import useIsMobile from "../hooks/useIsMobile";

const SearchLocation = ({ setResetSearch, setExpendSearch, expendSearch, searchResult }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleSearchPanel = () => {
    setExpendSearch(!expendSearch);
  };
  const closeSearchPanel = () => {
    setResetSearch(true);
    navigate(routes.map);
  };
  return (
    <>
      <button
        onClick={toggleSearchPanel}
        className={`absolute shadow-md w-9 h-9 top-12 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[13] hover:border-0
          ${isMobile? expendSearch? "right-[calc(100vw-36px)] shadow-lg rotate-0" : "right-[20px] rotate-180" : expendSearch ? "right-[480px] rotate-0" : "right-[100px] rotate-180"}`}
        aria-label="Collapse search results"
      >
        <img
          src="/arrow_right.svg"
          className={`h-6 w-6 ${expendSearch ? "-mt-[15%]" : "-mt-[10%]"}`}
          alt="Collapse"
        />
      </button>

      <button
        onClick={closeSearchPanel}
        className={`absolute shadow-md w-9 h-9 top-2 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[13] hover:border-0
          ${isMobile? expendSearch? "right-[calc(100vw-36px)] shadow-lg" : "right-[20px]" : expendSearch ? "sm:right-[480px]" : "sm:right-[100px]"}`}
        aria-label="Collapse search results"
      >
        <img src="/Close_round.svg" alt="Close_round" className="scale-125" />
      </button>
      {/* <div className={`transition-all bottom-0 duration-300 ease-in-out absolute sm:right-[var(--sidebar-width)] right-0 top-[200px] z-[10] bg-white shadow-lg  overflow-x-hidden overflow-y-auto`}> */}
      <div
        className={`z-[10] absolute bg-white shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans 
          sm:right-[77px] sm:top-2 sm:bottom-[var(--promptbar-height)] right-0 bottom-[var(--sidebar-and-prompt-bar)] h-[calc(100vh-var(--sidebar-width)-200px)] sm:h-auto h-min-[calc(100vh-200px)]
        transition-all duration-500
        ${expendSearch ? "sm:w-[400px] w-full bg-white" : "w-4 sm:w-4 bg-zinc-100"}`}
        dir="rtl"
        style={{
          backgroundColor: expendSearch ? "#ffffff" : "#F3F3F4",
          borderRadius: "10px",
          // boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <SearchResults
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
          searchResult={searchResult}
        />
      </div>
    </>
  );
};

SearchLocation.propTypes = {
  resetConfiguration: PropTypes.func.isRequired,
  setExpendSearch: PropTypes.func.isRequired,
  expendSearch: PropTypes.bool.isRequired,
};

export default memo(SearchLocation);
