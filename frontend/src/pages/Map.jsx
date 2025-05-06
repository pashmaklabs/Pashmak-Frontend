import { useState, memo } from "react";
import MapView from "../components/MapView";
import PromptBar from "../components/PromptBar";
import LocateButton from "../components/LocateButton";
import { useGetRequest, usePostRequest } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Map = ({ expendSearch, setExpendSearch, setSearchResult }) => {
  const [userLocation, setUserLocation] = useState(null);

  const [staticPoints, setStaticPoints] = useState([
    { id: 1, name: "Point A", lat: 35.6997, lon: 51.3381 },
    { id: 2, name: "Point B", lat: 35.7153, lon: 51.4043 },
    { id: 3, name: "Point C", lat: 35.7326, lon: 51.4469 },
  ]);

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
    // return new Promise((resolve, reject) => {
    //   fetchInitialTags(
    //     { url: "/api/tags" },
    //     {
    //       onSuccess: (data) => {
    //         resolve(data.tags);
    //       },
    //       onError: (error) => {
    //         console.error("Error fetching initial tags:", error);
    //         reject(error);
    //       },
    //     }
    //   );
    // });
  };

  const { mutate: fetchSuggestedTags, isLoading: isFetchingSuggestedTags } =
    usePostRequest();
  const handleFetchSuggestedTags = async (input) => {
    return ["کتابخانه", "طبیعت"];
    // return new Promise((resolve, reject) => {
    //   fetchSuggestedTags(
    //     { url: `/api/suggestions`, data: { query: input } },
    //     {
    //       onSuccess: (data) => {
    //         resolve(data.suggestions);
    //       },
    //       onError: (error) => {
    //         console.error("Error fetching suggested tags:", error);
    //         reject(error);
    //       },
    //     }
    //   );
    // });
  };

  const {
    mutate: search,
    data: searchOutput,
    isPending: isGettingResult,
    error,
  } = useGetRequest();
  const handleSubmitData = ({ input, tags }) => {
    navigate("/map/search");
    search(
      { endpoint: "/places", params: { q: input } },
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
            toast.error("An error occurred. Please try again.");
          }
        },
      },
    );
  };
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>
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
      <MapView userLocation={userLocation} staticPoints={staticPoints} />
    </div>
  );
};

export default memo(Map);
