import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ setExpendSearch, expendSearch }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExpendSearch(true);
    console.log(("uaudgaugug"))
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

  const handleMinimize = () => {
    setExpendSearch(false);
  };

  const handleMaximize = () => {
    setExpendSearch(true);
  };

  const handlePlacePick = () => {
    setExpendSearch(true);
    navigate("/map/place");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <>
      {/* Maximize button - rendered outside the collapsible panel */}

      {!expendSearch && (
        <button
          onClick={handleMaximize}
          className="fixed w-9 h-9 right-20 top-4 p-2 rounded-full bg-white hover:bg-gray-100 bg-red shadow-md z-50"
          aria-label="Maximize search results"
        >
          <img
            src="/arrow_left.svg"
            className="h-6 w-6 -mt-1"
            alt="Maximize"
          />
        </button>
      )}

      {/* Main collapsible panel */}
      <div
        className={`font-sans fixed right-16 top-0 z-40 bg-white shadow-lg h-screen transition-all duration-700 ease-in-out ${
          expendSearch ? "w-[400px] bg-white" : "w-[16px] bg-zinc-100 overflow-hidden"
        }`}
        dir="rtl"
      >
        <div className="h-full flex flex-col">
          {/* Header section */}
          <div className="flex-shrink-0 pt-2 px-4">
            <button
              onClick={handleMinimize}
              className={`absolute w-9 h-9 -left-10 top-4 p-2 rounded-full hover:bg-gray-100 bg-white z-50 ${
                !expendSearch && "hidden"
              }`}
            >
              <img
                src="/arrow_right.svg"
                className="h-6 w-6 -mt-1"
                alt="Minimize"
              />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mb-4">نتایج جستجو</h1>
          </div>

          {/* Scrollable content area */}
          <div className="flex-grow overflow-y-auto px-4 scrollbar-hide">
            {loading ? (
              <p className="text-gray-500 text-center py-4">در حال بارگذاری...</p>
            ) : results.length > 0 ? (
              <div className="space-y-4 pb-4">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 last:border-b-0 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors py-4"
                    onClick={handlePlacePick}
                  >
                    <div className="flex flex-row-reverse">
                      <div className="ml-5 m-2 w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow m-2">
                        <h2 className="font-semibold text-2xl text-gray-700 mb-2">
                          {item.name}
                        </h2>
                        <div className="h-6 bg-gray-100 shadow-slate-400 rounded-xl inline-flex items-center px-2">
                          <p className="text-sm text-gray-500 w-20 text-center mb-1">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex mr-1">
                            {renderStars(item.place_rating)}
                          </div>
                          <span className="text-gray-600 text-sm">
                            {item.place_rating}
                          </span>
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
              <p className="text-gray-500 text-center py-4">نتیجه‌ای یافت نشد</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;