import { useState, useRef, useEffect } from "react";
import StarRating from "./StarRating";
import { NotebookPenIcon, X } from "lucide-react";
import {
  usePatchRequest,
  useGetRequest,
  useDeleteRequest,
} from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SavedLocation({
  savedLocation,
  reRenderer,
  setReRenderer,
}) {
  const [showNoteBar, setShowNoteBar] = useState(
    savedLocation.UserNote.length > 0,
  );

  const [note, setNote] = useState(savedLocation.UserNote);
  const textAreaRef = useRef(null);
  const navigate = useNavigate();
  const [place, setPlace] = useState({});
  const [nameToShow, setNameToShow] = useState(
    !savedLocation.PlaceID && savedLocation.Name !== ""
      ? savedLocation.Name
      : savedLocation.Latitude + " ," + savedLocation.Longitude,
  );

  const handlePlaceSelect = (item) => {
    navigate(
      `/map/place?&id=${item.id}&lat=${item.latitude}&lng=${item.longitude}`,
    );
  };

  //api to get the "real place" from id place id lng lat of props.place
  const {
    mutate: getPlaceDetails,
    data: placeDetails,
    isPending: isGettingPlaceDetails,
    error: getPlaceDetailsError,
  } = useGetRequest();

  useEffect(() => {
    if (savedLocation.PlaceID) {
      getPlaceDetails(
        {
          endpoint: `/places/${savedLocation.PlaceID}`,
          params: {},
        },
        {
          onSuccess: (data) => {
            setPlace(data.place);
            setNameToShow(data.place.name);
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
  }, []);

  //api5 taghire note makan
  const { mutate: changeLocationNote, isLoading: isChangingLocationNote } =
    usePatchRequest();
  const handleBlurNoteBar = (e) => {
    if (note.length === 0) {
      setShowNoteBar(false);
    }
    changeLocationNote(
      {
        url: `/profiles/me/saved/location`,
        data: {
          place_label_id: savedLocation.PlaceLabelId,
          id: savedLocation.ID,
          user_note: note,
          name: savedLocation.Name,
        },
      },
      {
        onSuccess: (data) => {
          toast.success("یادداشت با موفقیت تغییر یافت.");
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  // api delete kardane makan
  const {
    mutate: removeLocationFromGroup,
    isLoading: isRemovingLocationFromGroup,
  } = useDeleteRequest();

  const handleRemoveLocationButtonClick = (e) => {
    e.stopPropagation();
    removeLocationFromGroup(
      {
        url: `/profiles/me/saved/location/${savedLocation.ID}`,
      },
      {
        onSuccess: (data) => {
          setReRenderer(!reRenderer);
          toast.success("حذف مکان موفقیت آمیز بود");
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("خطا در دریافت اطلاعات مکان ها");
          }
        },
      },
    );
  };

  const handleWriteNoteClick = (e) => {
    e.stopPropagation();
    setShowNoteBar(true);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const resizeTextArea = (e) => {
    const el = textAreaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div
      className="flex flex-col items-center
                  justify-center border-b-2
                  "
    >
      {isGettingPlaceDetails ? (
        // loading placeholders
        <div
          className="flex flex-col items-start
                        justify-start h-full w-full p-2
                        animate-pulse"
        >
          <div
            className="flex gap-x-4 items-center justify-center
                          "
          >
            {/* picture placeholder */}
            <div className=" w-24 flex-shrink-0 rounded-lg overflow-hidden">
              <div className="bg-gray-200 w-24 aspect-square"></div>
            </div>
            <div
              className="flex flex-col items-start justify-center
                            space-y-2"
            >
              {/* name placeholder */}
              <div className="bg-gray-200 w-32 h-7 rounded-full"></div>
              {/* stars placeholder */}
              <div className="bg-gray-200 w-16 h-7 rounded-full"></div>
            </div>
          </div>
          <div
            className="bg-gray-200 h-7
                            mt-2 rounded-lg w-80"
          ></div>
        </div>
      ) : (
        /*place in database with place id*/
        <div
          className="flex flex-col items-start
                      justify-start h-full w-full
                      relative hover:bg-gray-200
                      p-2"
          onClick={() => handlePlaceSelect(place)}
        >
          <div className="flex gap-x-4 items-center justify-center">
            <div className=" w-24 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={place.image_urls&&place.image_urls.length>0?place.image_urls[0] : "/placeHolder.png" }
                alt={place.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span
                className="font-semibold text-2xl text-gray-700
                             mb-2 max-w-64 break-words"
              >
                {nameToShow}
              </span>
              <div className="flex items-center mt-2 h-5 pb-2">
                <StarRating rating={place.rating} reviews={0} />
              </div>
              <span className="text-gray-500 text-sm mt-1 line-clamp-1 max-w-[300px]">
                {place.address}
              </span>
            </div>
          </div>
          {/* note button */}
          {!showNoteBar && (
            <div className="flex flex-col justify-end mt-2">
              <button
                className="bg-white border-gray-400 rounded-full
                            flex items-center justify-center gap-1
                            hover:border-gray-400 p-1"
                onClick={handleWriteNoteClick}
              >
                <span className="text-gray-900 text-sm">یادداشت</span>
                <NotebookPenIcon className="text-blue-950 w-4 h-4" />
              </button>
            </div>
          )}
          {/* add note input bar */}
          {showNoteBar && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex items-center justify-center
                            mt-2 w-full"
            >
              <textarea
                value={note}
                ref={textAreaRef}
                rows={1}
                wrap="hard"
                placeholder="یادداشت خود را بنویسید"
                className="focus:border-2 border-gray-300 text-gray-900
                              bg-transparent focus:outline-none rounded-md
                              w-full text-start p-1 text-base
                              scrollbar-hide resize-none"
                onChange={handleNoteChange}
                onBlur={handleBlurNoteBar}
                onFocus={resizeTextArea}
                onInput={resizeTextArea}
              ></textarea>
            </div>
          )}
          {/* remove location button */}
          <div
            className="flex items-center justify-center
                          absolute top-0 left-0
                          text-gray-900 focus:cursor-pointer
                          p-1"
          >
            <X
              className="hover:cursor-pointer
                            hover:text-red-600 transition-colors duration-200"
              onClick={handleRemoveLocationButtonClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
