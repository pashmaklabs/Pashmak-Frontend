import { useState, memo } from "react";
import MapView from "../components/MapView";
import PromptBar from "../components/PromptBar";
import LocateButton from "../components/LocateButton";
import { usePostRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);

  const [staticPoints, setStaticPoints] = useState([
    { id: 1, name: "Point A", lat: 35.6997, lon: 51.3381 },
    { id: 2, name: "Point B", lat: 35.7153, lon: 51.4043 },
    { id: 3, name: "Point C", lat: 35.7326, lon: 51.4469 },
  ]);

  const { mutate: fetchInitialTags, isLoading: isFetchingInitialTags } =
    usePostRequest();
  const handleFetchInitialTags = async () => {
    return ["رستوران", "کافه", "پارک", "هتل", "موزه", "سینما", "تئاتر"];
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

  const { mutate: submitData, isLoading: isSubmitting } = usePostRequest();
  const handleSubmitData = (input, tags) => {
    // submitData(
    //   { url: "/api/submit", data: { input, tags } },
    //   {
    //     onSuccess: () => {
    //       console.log("Data submitted successfully!");
    //       alert("Submission successful!");
    //     },
    //     onError: (error) => {
    //       console.error("Error submitting data:", error);
    //       if (error.response?.data?.message) {
    //         alert(error.response.data.message);
    //       } else {
    //         alert("An error occurred. Please try again.");
    //       }
    //     },
    //   }
    // );
    navigate("/map/search")
  };
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>
      <PromptBar
        fetchInitialTags={handleFetchInitialTags}
        fetchSuggestedTags={handleFetchSuggestedTags}
        submitData={handleSubmitData}
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
