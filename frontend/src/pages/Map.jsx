import { useState, memo, useEffect } from "react";
import MapView from "../components/MapView";
import PromptBar from "../components/PromptBar";
import LocateButton from "../components/LocateButton";
import SearchLoader from "../components/SearchLoader";
import { useGetRequest, usePostRequest } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useInput } from "../stores/map";

const Map = ({
  resetSearch,
  setResetSearch,
  expendSearch,
  setExpendSearch,
  setSearchResult,
  bookmarkedLocationsPoints,
  searchWithHistory,
  setSearchWithHistory,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const { setInput } = useInput();
  const [places, setPlaces] = useState([]);
  const location = useLocation();
  const [prompt, setPrompt] = useState(false);
  const [isShowingFancyLoader, setIsShowingFancyLoader] = useState(false);
  const { mutateAsync: searchAsync } = useGetRequest();
  const profile = location.pathname.includes(routes.profile);
  const changePassword = location.pathname.includes(routes.changePassword);

  const handleFetchInitialTags = async () => {
    return [
      "عطاری",
      "پمپ بنزین",
      "بستنی فروشی",
      "رستوران",
      "کافه",
      "پارک",
      "هتل",
      "موزه",
      "سینما",
      "تئاتر",
    ];
  };

  const handleFetchSuggestedTags = async (input) => {
    return ["کتابخانه", "طبیعت"];
  };

  const handleSubmitData = async ({ input, tags }) => {
    setInput(input);
    setPlaces([]);
    setSearchResult([]);

    setIsShowingFancyLoader(true);

    try {
      const searchResultValue = await searchAsync({
        endpoint: "/places/",
        params: { q: input, agentic: true },
      });

      const { places: newPlaces } = searchResultValue;
      setSearchResult(newPlaces);
      setPlaces(newPlaces);
      navigate("/map/search");
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("خطایی رخ داده. لطفا دوباره امتحان کنید");
      }
    } finally {
      setIsShowingFancyLoader(false);
    }
  };

  const handlePointClick = ({ id, lat, lng }) => {
    if (id && lat && lng && location.pathname !== routes.dir) {
      const newParams = new URLSearchParams();
      newParams.set("id", id);
      newParams.set("lat", lat.toFixed(5));
      newParams.set("lng", lng.toFixed(5));
      navigate({ pathname: routes.place, search: `?${newParams.toString()}` });
    }
  };

  // checks if user is viewing saved locations in a specific group
  const bookmarksParams = new URLSearchParams(location.search);
  const isLocationGroup = bookmarksParams.get("group") !== null;

  useEffect(() => {
    setPrompt(!location.pathname.includes(routes.dir));
  }, [location.pathname]);

  useEffect(() => {
    console.log(resetSearch);
    if (resetSearch === true) setPlaces([]);
  }, [resetSearch]);

  return (
    <div style={{ position: "relative" }}>
      <Helmet>
        <title>نقشه</title>
      </Helmet>

      {isShowingFancyLoader && (
        <SearchLoader isVisible={isShowingFancyLoader} />
      )}

      {prompt && !profile && !changePassword && (
        <PromptBar
          resetSearch={resetSearch}
          setResetSearch={setResetSearch}
          fetchInitialTags={handleFetchInitialTags}
          fetchSuggestedTags={handleFetchSuggestedTags}
          submitData={handleSubmitData}
          expendSearch={expendSearch}
          setExpendSearch={setExpendSearch}
          searchWithHistory={searchWithHistory}
          setSearchWithHistory={setSearchWithHistory}
        />
      )}
      {!profile && (
        <LocateButton
          setUserLocation={setUserLocation}
          userLocation={userLocation}
        />
      )}

      <MapView
        userLocation={userLocation}
        staticPoints={
          isLocationGroup && bookmarkedLocationsPoints
            ? bookmarkedLocationsPoints
            : resetSearch
              ? []
              : places
        }
        onPointClick={handlePointClick}
      />
    </div>
  );
};

export default memo(Map);
