import { useState, memo, useEffect } from "react";
import MapView from "../components/MapView";
import PromptBar from "../components/PromptBar";
import LocateButton from "../components/LocateButton";
import { useGetRequest, usePostRequest } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useInput } from "../stores/map";

const Map = ({
  expendSearch,
  staticPoints,
  setExpendSearch,
  setSearchResult,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { input, setInput } = useInput();

  const { mutate: fetchInitialTags, isLoading: isFetchingInitialTags } =
    usePostRequest();
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

  const { mutate: fetchSuggestedTags, isLoading: isFetchingSuggestedTags } =
    usePostRequest();
  const handleFetchSuggestedTags = async (input) => {
    return ["کتابخانه", "طبیعت"];
  };
  const {
    mutate: search,
    data: searchOutput,
    isPending: isGettingResult,
    error,
  } = useGetRequest();
  const handleSubmitData = ({ input, tags }) => {
    navigate("/map/search");
    setInput(input);
    search(
      { endpoint: "/places/", params: { q: input } },
      {
        onSuccess: ({ places }) => {
          setSearchResult([]);
          setSearchResult(places);

          try {
            const jsonString = JSON.stringify(places);
            const base64 = btoa(unescape(encodeURIComponent(jsonString)));
            localStorage.setItem("search_places", base64);
          } catch (e) {
            console.error("Failed to store results in localStorage", e);
          }
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("خطایی رخ داده. لطفا دوباره امتحان کنید");
          }
        },
      },
    );
  };

  const handlePointClick = ({ id, lat, lng }) => {
    if (id && lat && lng && location.pathname != routes.dir) {
      const newParams = new URLSearchParams();
      newParams.set("id", id);
      newParams.set("lat", lat.toFixed(5));
      newParams.set("lng", lng.toFixed(5));

      navigate({
        pathname: routes.place,
        search: `?${newParams.toString()}`,
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Helmet>
        <title>نقشه</title>
      </Helmet>

      <PromptBar
        fetchInitialTags={handleFetchInitialTags}
        fetchSuggestedTags={handleFetchSuggestedTags}
        submitData={handleSubmitData}
        expendSearch={expendSearch}
      />
      <LocateButton
        setUserLocation={setUserLocation}
        userLocation={userLocation}
      />
      <MapView
        userLocation={userLocation}
        staticPoints={searchOutput?.places}
        onPointClick={handlePointClick}
      />
    </div>
  );
};

export default memo(Map);
