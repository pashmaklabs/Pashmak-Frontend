import { useState, useEffect } from "react";
import SavedLocation from "./SavedLocation";
import { useGetRequest } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookmarkGroupDetails({
  setState,
  selectedGroup,
  setBookmarksLocationsPoints,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [reRenderer, setReRenderer] = useState();

  const [results, setResults] = useState([]);

  //api4 gereftane location haye in group
  const {
    mutate: getSavedLocations,
    data: SavedLocations,
    isPending: isGettingResult,
    error: error,
  } = useGetRequest();

  useEffect(() => {
    getSavedLocations(
      {
        endpoint: `/profiles/me/saved/location/${selectedGroup.id}`,
        params: {},
      },
      {
        onSuccess: (data) => {
          setResults(data.results);
        },
        onError: () => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("خطا در دریافت اطلاعات مکان ها");
          }
        },
      },
    );
  }, [reRenderer]);

  const handleCloseGroupButton = () => {
    setState("bookmarksGroupsList");
    navigate("/map/bookmarks");
    setBookmarksLocationsPoints(null);
  };

  let tempArr = [];
  results.forEach((place) => {
    tempArr = [
      ...tempArr,
      {
        osm_id: place.PlaceID,
        latitude: parseFloat(place.Latitude),
        longitude: parseFloat(place.Longitude),
      },
    ];
  });

  useEffect(() => {
    setBookmarksLocationsPoints(tempArr);
  }, [results]);

  return (
    <div className="h-full">
      {/* header */}
      <div
        className="relative flex items-center
                      justify-between py-4
                      pr-4 pl-5 shadow-md
                      "
      >
        {/* group name */}
        <div className="flex flex-col items-start justify-start">
          <span className="text-gray-900 text-2xl">{selectedGroup.name}</span>
          <span className="text-gray-400 text-md ">
            {selectedGroup.saved_locations_count} مکان
          </span>
        </div>

        {/* close group button */}
        <div
          className="flex items-center justify-center 
                        float-right
                        "
        >
          <button
            className="bg-white border-none focus:outline-none 
                              text-purple-600 p-1 hover:text-purple-800
                                text-md
                                "
            onClick={handleCloseGroupButton}
          >
            بازگشت
          </button>
        </div>
      </div>

      {!isGettingResult && results.length === 0 ? (
        <div
          className="flex w-full items-center justify-center
                      p-4"
        >
          <span className="text-gray-900">مکانی وجود ندارد.</span>
        </div>
      ) : (
        /* saved locations in this group */
        <div className="h-[92%] overflow-y-scroll overflow-x-hidden scrollbar-hide">
          {isGettingResult ? (
            <div
              className="flex items-center justify-center
                      p-4 w-full "
            >
              <span className="text-gray-900">در حال دریافت اطلاعات ...</span>
            </div>
          ) : (
            results.map((item, index) => (
              <div key={item.ID} className="">
                <SavedLocation
                  savedLocation={item}
                  reRenderer={reRenderer}
                  setReRenderer={setReRenderer}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
