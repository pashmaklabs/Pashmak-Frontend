import { useEffect, useState } from "react";
import { memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PlaceInfoContainer from "../components/PlaceInfoContainer";
import { useGetRequest } from "../services/api";
import { toast } from "react-toastify";

const PlaceDetail = ({ expendSearch, setExpendSearch, hasSearch }) => {
  const [searchParams] = useSearchParams();
  const pointId = searchParams.get("id");
  const navigate = useNavigate();

  const {
    mutate: getPointDetails,
    data: pointDetails,
    isPending: isLoading,
    error,
  } = useGetRequest();

  useEffect(() => {
    if (pointId) {
      getPointDetails(
        {
          endpoint: `/places/${pointId}`,
          params: {}, // or any actual query params you want
        },
        {
          onSuccess: (data) => {
            // Handle the successful response here, e.g.:
            console.log("Point details:", data);
          },
          onError: (error) => {
            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("مکان مورد نظر یافت نشد");
            }
          },
        },
      );
    }
  }, [pointId]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching point details:", error);
    }
  }, [error]);

  return (
    <div
      dir="rtl"
      className={` z-[13] absolute bg-white shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans ${
        expendSearch
          ? "right-[475px] h-[80%] rounded-xl w-[350px] bottom-8"
          : " sm:w-[400px] w-full sm:right-[var(--sidebar-width)] sm:top-0 right-0  sm:bottom-0 bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width))] sm:h-auto"
      }  transition-all duration-500`}
    >
      <PlaceInfoContainer
        hasSearch={hasSearch}
        setExpendSearch={setExpendSearch}
        expendSearch={expendSearch}
        name={pointDetails?.place.name}
        rating={pointDetails?.place.rating}
      />
    </div>
  );
};

export default memo(PlaceDetail);
