import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { toast } from "react-toastify";

const SearchResults = ({ setExpendSearch, expendSearch }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setExpendSearch(true);
        const response = await fetch("/example_search_resault.json");
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [setExpendSearch]);

  const toggleSearchPanel = () => {
    setExpendSearch(!expendSearch);
  };

  const handlePlaceSelect = () => {
    setExpendSearch(true);
    navigate("/map/place");
  };

  return (
    <>
      {/* Floating toggle button */}
      {!expendSearch && (
        <button
          onClick={toggleSearchPanel}
          className="fixed w-9 h-9 right-20 top-4 p-2 rounded-full bg-white hover:bg-gray-100 shadow-md z-[10]"
          aria-label="Expand search results"
        >
          <img src="/arrow_left.svg" className="h-6 w-6 -mt-1" alt="Expand" />
        </button>
      )}

      {/* Main panel */}
      <div
        className={`font-sans fixed right-16 top-0 z-[10] bg-white shadow-lg h-screen transition-all duration-300 ease-in-out ${
          expendSearch ? "w-[400px]" : "w-4 bg-zinc-100 overflow-hidden"
        }`}
        dir="rtl"
      >
        {expendSearch && (
          <div className="h-full flex flex-col">
            {/* Panel header */}
            <div className="flex-shrink-0 pt-2 px-4 relative">
              <button
                onClick={toggleSearchPanel}
                className="absolute w-9 h-9 -left-10 top-4 p-2 rounded-full hover:bg-gray-100 bg-white z-[10]"
                aria-label="Collapse search results"
              >
                <img
                  src="/arrow_right.svg"
                  className="h-6 w-6 -mt-1"
                  alt="Collapse"
                />
              </button>
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                نتایج جستجو
              </h1>
            </div>

            {/* Results content */}
            <div className="flex-grow overflow-y-auto px-4 scrollbar-hide">
              {loading ? (
                <p className="text-gray-500 text-center py-4">
                  در حال بارگذاری...
                </p>
              ) : results.length > 0 ? (
                <div className="space-y-4 pb-4">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-200 last:border-b-0 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors py-4"
                      onClick={handlePlaceSelect}
                    >
                      <div className="flex flex-row-reverse">
                        <div className="ml-5 m-2 w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-grow m-2">
                          <h2 className="font-semibold text-2xl text-gray-700 mb-2">
                            {item.name}
                          </h2>
                          <div className="h-6 bg-gray-100 rounded-xl inline-flex items-center px-2">
                            <p className="text-sm text-gray-500 w-20 text-center mb-1">
                              {item.category}
                            </p>
                          </div>
                          <div className="flex items-center mt-2 h-5 pb-2">
                            <StarRating
                              rating={item.place_rating}
                              reviews={item.comment_count}
                            />
                          </div>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-1 max-w-[300px]">
                            {item.address.length > 50
                              ? `${item.address.substring(0, 50)}...`
                              : item.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  نتیجه‌ای یافت نشد
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

SearchResults.propTypes = {
  setExpendSearch: PropTypes.func.isRequired,
  expendSearch: PropTypes.bool.isRequired,
};

export default SearchResults;
