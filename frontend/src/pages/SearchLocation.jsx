import { memo } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/SearchResults";
import { Helmet } from "react-helmet";

const SearchLocation = ({
  setHasdSearch,
  setExpendSearch,
  expendSearch,
  searchResult,
}) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const toggleSearchPanel = () => {
    setExpendSearch(!expendSearch);
  };

  return (
    <>
      <Helmet>
        <title>جست و جو</title>
      </Helmet>
      <button
        onClick={toggleSearchPanel}
        className={`absolute shadow-md w-9 h-9 top-2 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[12] hover:border-0
          ${expendSearch ? "right-[480px] rotate-0" : "right-[90px] rotate-180"}`}
        aria-label="Collapse search results"
      >
        <img
          src="/arrow_right.svg"
          className={`h-6 w-6 ${expendSearch ? "-mt-[15%]" : "-mt-[10%]"}`}
          alt="Collapse"
        />
      </button>
      {/* <div className={`transition-all bottom-0 duration-300 ease-in-out absolute sm:right-[var(--sidebar-width)] right-0 top-[200px] z-[10] bg-white shadow-lg  overflow-x-hidden overflow-y-auto`}> */}
      <div
        className={` z-[10] absolute bg-white shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans 
          sm:right-[var(--sidebar-width)] sm:top-[200px] right-0  sm:bottom-0 bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width)-200px)] sm:h-auto h-min-[calc(100vh-200px)]
        transition-all duration-500
        ${expendSearch ? "sm:w-[400px] w-full bg-white" : "w-4 sm:w-4 bg-zinc-100"}`}
        dir="rtl"
        style={{
          backgroundColor: expendSearch ? "#ffffff" : "#F3F3F4",
        }}
      >
        <SearchResults
          setHasdSearch={setHasdSearch}
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
          searchResult={searchResult}
        />
      </div>
    </>
  );
};

SearchLocation.propTypes = {
  setHasdSearch: PropTypes.func.isRequired,
  setExpendSearch: PropTypes.func.isRequired,
  expendSearch: PropTypes.bool.isRequired,
};

export default memo(SearchLocation);
