import React from "react";
import { memo } from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/SearchResults";

const SearchLocation = ({
  setHasdSearch,
  setExpendSearch,
  expendSearch,
  searchResult,
}) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className={`transition-all duration-300 ease-in-out`}>
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
