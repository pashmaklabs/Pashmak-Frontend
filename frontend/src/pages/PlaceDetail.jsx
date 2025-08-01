import { useEffect, useLayoutEffect, useState } from "react";
import { memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PlaceInfo from "../components/PlaceInfo";
import { useGetRequest } from "../services/api";
import { toast } from "react-toastify";
import { usePrevRouteStore } from "../stores/routing";
import StarRating from "../components/StarRating";
import { Helmet } from "react-helmet";
import routes from "../routes/Routes";
import CommentsList from "../components/CommentsList";
import PlaceImages from "../components/PlaceImages";
import useIsMobile from "../hooks/useIsMobile";

const PlaceDetail = ({
  expendSearch,
  setExpendSearch,
  searchClosed,
  hasSearch,
}) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [imageUrl, setImageUrl] = useState("/placeHolder.png");

  const [activeTab, setActiveTab] = useState("اطلاعات کلی");
  const tabs = ["اطلاعات کلی", "نظرات", "تصاویر"];
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [searchParams] = useSearchParams();
  const pointId = searchParams.get("id");
  const navigate = useNavigate();
  const setPreviousRoute = usePrevRouteStore((state) => state.setPreviousRoute);
  const [expendPlace, setExpendPlace] = useState(true);
  useLayoutEffect(() => {
    const section = document.getElementById(`section-${activeTab}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  const {
    mutate: getPointDetails,
    data: pointDetails,
    isPending: isLoading,
    error,
  } = useGetRequest();

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <button
        key={tab}
        className={`flex-1 py-2 text-center bg-transparent text-xs ${
          activeTab === tab ? "font-bold text-gray-800" : "text-gray-600"
        }`}
        style={{
          outline: "none",
          background: "transparent",
          border: "none",
        }}
        onClick={() => {
          setActiveTab(tab);
          if (tab !== "نظرات") {
            setShowCommentForm(false);
          }
          // document.getElementById(`section-${index}`)?.scrollIntoView({
          //   behavior: "smooth",
          // });
        }}
      >
        {tab}
      </button>
    ));
  };

  const onClose = () => {
    if (hasSearch && !searchClosed) {
      if (!expendSearch) {
        setExpendSearch(true);
      } else {
        navigate(routes.search);
      }
    } else navigate(routes.map);
  };

  const handleSubmitCommentButton = () => {
    setActiveTab("نظرات");
    setShowCommentForm(true);
  };

  useEffect(() => {
    if (pointId) {
      getPointDetails(
        {
          endpoint: `/places/${pointId}`,
          params: {}, // or any actual query params you want
        },
        {
          onSuccess: (data) => {
            
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

  useEffect(() => {
    console.log("1");
    if (pointDetails) {
      console.log(pointDetails);
      setName(pointDetails.place.name || "بدون نام");
      setRating(pointDetails.place.rating || 0);
      setReviews(pointDetails.place.reviews || 0);
      const lat = searchParams.get("lat");
      const lng = searchParams.get("lng");

      if (!lat || !lng) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("lat", pointDetails.place.latitude);
        newSearchParams.set("lng", pointDetails.place.longitude);
        navigate(`${location.pathname}?${newSearchParams.toString()}`);
      }
      if(pointDetails.place.image_urls && pointDetails.place.image_urls.length>0)
        setImageUrl(pointDetails.place.image_urls[0].replace(/w\d+-h\d+/, 'w220-h220'))
        // console.log(imageUrl)
    }
  }, [pointDetails]);

  const handleRouteClick = () => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      setPreviousRoute({
        pathname: location.pathname,
        search: location.search,
      });

      const endParam = `${lat},${lng}`;
      navigate(`${routes.dir}?end=${endParam}`);
    }
  };

  const togglePlace = () => {
    setExpendPlace(!expendPlace);
  };
  return (
    <>
      {isMobile && (
        <img
          src="/arrow_right.svg"
          className={`h-9 w-9 shadow-md transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white hover:border-0  z-[14]  absolute cursor-pointer ${expendPlace ? "left-2 top-2" : "rotate-180 right-2 top-2"}`}
          alt="Collapse"
          onClick={togglePlace}
        />
      )}
      <div
        dir="rtl"
        className={` z-[13] absolute scrollbar-hide bg-white shadow-md scroll-smooth overflow-x-hidden font-sans rounded-xl 
        ${
          expendSearch && !isMobile
            ? "right-[485px] h-[80%] w-[350px] bottom-8"
            : " sm:w-[400px] w-full sm:right-[calc(var(--sidebar-width)+6px)]  sm:top-2 right-0  sm:bottom-[var(--promptbar-height)] bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width))] sm:h-auto"
        }
      ${isMobile && !expendPlace ? "hidden" : ""}  
      transition-all duration-500`}
      >
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <div className="flex flex-col justify-center items-center  top-0 z-10 w-full">
          {/* Section 1: Image */}
          <div className="w-full h-[220px]">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-center"
            />
            {hasSearch && !expendSearch && !searchClosed ? (
              <div
                onClick={onClose}
                className="fixed w-9 h-9 right-[85px] top-4 p-2 rounded-full bg-white hover:bg-gray-100 shadow-md z-[10] cursor-pointer"
                aria-label="Expand search results"
              >
                <img
                  src="/arrow_left.svg"
                  className="h-6 w-6 -mt-0.5"
                  alt="Expand"
                />
              </div>
            ) : (
              <img
                src="/closeWhiteBg.svg"
                alt="close"
                className="absolute top-2 right-2 w-9 h-9 cursor-pointer"
                onClick={onClose}
              />
            )}
          </div>

          <div className="flex flex-row items-center bg-white justify-start w-full">
            {/* Section 2: Name and Rating */}
            <div className="p-4 bg-white w-full">
              <h2 className="text-xl font-sans-bold text-black">{name}</h2>
              <StarRating rating={rating} reviews={reviews} />
            </div>

            {/* submit comment button */}
            <div className="flex flex-col justify-center items-cente gap-4 p-4 h-full">
              <button
                className="w-[100px] py-1 bg-white border border-purple-500
                                     text-purple-500 text-sm rounded-lg 
                                      focus:outline-none focus:border-purple-500 hover:border-purple-500"
                onClick={(e) => {
                  handleSubmitCommentButton();
                  e.currentTarget.blur(); // This will remove focus from the button
                }}
              >
                ثبت نظر
              </button>
            </div>
          </div>

          {/* Section 3: Tabs */}
          <div className=" bg-white border-b border-gray-300  w-full">
            <div className="flex justify-around">{renderTabs()}</div>
            <div
              className=" bottom-0 h-[3px] bg-purple-500 transition-all duration-300"
              style={{
                width: `${100 / tabs.length}%`,
                transform: `translateX(${-tabs.indexOf(activeTab) * 100}%)`,
              }}
            ></div>
          </div>
        </div>

        {activeTab === "اطلاعات کلی" && (
          <>
            <PlaceInfo
              address={pointDetails?.place.address}
              weeklySchedule={pointDetails?.place.weeklySchedule}
              phone={pointDetails?.place.phone}
              links={pointDetails?.place.links}
              handleSubmitCommentButton={handleSubmitCommentButton}
              handleRouteClick={handleRouteClick}
            />
          </>
        )}
        {activeTab === "نظرات" && (
          <div className="flex items-center justify-center w-full h-full max-h-[412px]">
            <CommentsList
              showCommentForm={showCommentForm}
              handleSubmitCommentButton={handleSubmitCommentButton}
              setShowCommentForm={setShowCommentForm}
            />
          </div>
        )}
        {activeTab === "تصاویر" && (
          <div className="flex items-center justify-center w-full h-full max-h-[412px]">
            <PlaceImages
              pointId={pointId}
              onImageUpload={(image) => {
                console.log("New image uploaded:", image);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(PlaceDetail);
