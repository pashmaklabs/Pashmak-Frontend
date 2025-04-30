import React from "react";
import { memo } from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/SearchResults";

const SearchLocation = ({ setHasdSearch, setExpendSearch, expendSearch }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/example_search_resault.json")
      .then((response) => response.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className={`transition-all duration-300 ease-in-out`}>
        <SearchResults
          setHasdSearch={setHasdSearch}
          setExpendSearch={setExpendSearch}
          expendSearch={expendSearch}
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
