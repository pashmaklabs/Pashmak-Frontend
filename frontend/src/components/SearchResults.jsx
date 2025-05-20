import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { Helmet } from "react-helmet";
import { useInput } from "../stores/map";

const SearchResults = ({ setExpendSearch, expendSearch, searchResult }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { input, setInput } = useInput();

  const handlePlaceSelect = (item) => {
    setExpendSearch(true);
    navigate(
      `/map/place?id=${item.osm_id}&lat=${item.latitude}&lng=${item.longitude}`,
    );
  };

  useEffect(() => {
    if (!expendSearch) {
      setExpendSearch(true);
    }
    setLoading(false);
  }, [searchResult]);

  return (
    <>
      {/* Floating toggle button */}
      {/* {!expendSearch && (
        <button
          onClick={toggleSearchPanel}
          className="absolute w-9 h-9 right-20 top-4 p-2 rounded-full bg-white hover:bg-gray-100 shadow-md z-[999]"
          aria-label="Expand search results"
        >
          <img src="/arrow_left.svg" className="h-6 w-6 -mt-1" alt="Expand" />
        </button>
      )} */}

      {/* Animated Panel */}
      {/* Animated Panel */}
      <div>
        <Helmet>
          <title>{input}</title>
        </Helmet>
        {expendSearch && (
          <div className="flex flex-col ">
            {/* Panel header */}
            <div className="flex-shrink-0 pt-2 px-4 relative">
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                نتایج جستجو
              </h1>
            </div>

            {/* Results content */}
            <div
              className={`flex-grow overflow-y-auto px-4 scrollbar-hide ${
                !expendSearch && "bg-zinc-100 overflow-hidden"
              }`}
            >
              {loading ? (
                <p className="text-gray-500 text-center py-4">
                  در حال بارگذاری...
                </p>
              ) : searchResult.length > 0 ? (
                <div className="space-y-4 pb-4">
                  {searchResult &&
                    searchResult.map((item) => (
                      <div
                        key={item.osm_id}
                        className="border-b border-gray-200 last:border-b-0 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors py-4"
                        onClick={() => handlePlaceSelect(item)}
                      >
                        <div className="flex flex-row-reverse">
                          <div className="ml-5 m-2 w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={"/unnamed.png"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-grow m-2">
                            <h2 className="font-semibold text-2xl text-gray-700 mb-2">
                              {item.name}
                            </h2>
                            {item.amenity && (
                              <div className="h-6 bg-gray-100 rounded-xl inline-flex items-center px-2">
                                <p className="text-sm text-gray-500 text-center mb-1">
                                  {item.amenity}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center mt-2 h-5 pb-2">
                              <StarRating rating={3.5} reviews={452} />
                            </div>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-1 max-w-[300px]">
                              هم اکنون آدرس دقیقی از این مکان موجود نیست
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
  searchResult: PropTypes.array.isRequired,
};

export default SearchResults;
