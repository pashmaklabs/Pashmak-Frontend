import { useState, useEffect } from "react";
import { XCircle, CheckIcon } from "lucide-react";
import { Heart, Flag, SuitcaseLines, PinCircle } from "solar-icon-set";
import {
  useGetRequest,
  usePatchRequest,
  usePostRequest,
} from "../services/api";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AddNewBookmarkGroupForm from "./AddBookmarkGroupForm";

export default function SaveLocationPopup({ setSaveLocationPopup }) {
  const [groups, setGroups] = useState([]);
  const [locationCurrnetGroup, setLocationCurrentGroup] = useState(null);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [refetchGroups, setRefetchGroups] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const latitude = parseFloat(queryParams.get("lat"));
  const longitude = parseFloat(queryParams.get("lng"));
  const placeId = parseFloat(queryParams.get("id"));

  const handleMakeNewGroupClick = () => {
    setShowNewGroupForm(true);
  };

  //api6 current group locaiton ro get konim
  const {
    mutate: fetchLocationCurrnetGroup,
    data: locationCurrGroup,
    isPending: isFetchingCurrentGroup,
    error: errorFetchingCurrentGroup,
  } = useGetRequest();
  useEffect(() => {
    if (placeId) {
      fetchLocationCurrnetGroup(
        {
          endpoint: `/places/${placeId}`,
          params: {},
        },
        {
          onSuccess: (data) => {
            setLocationCurrentGroup(data.place.saved_location);
          },
          onError: (error) => {
            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("خطایی رخ داده است. مجددا تلاش کنید");
            }
            setSaveLocationPopup(false);
          },
        },
      );
    }
  }, []);

  //api7 save kardane ye makan for first time
  const { mutate: saveLocation, isLoading: isAssigningGroup } =
    usePostRequest();
  const addLocationToGroup = (placeId, selectedGroup) => {
    saveLocation(
      {
        url: "/profiles/me/saved/location",
        data: {
          place_id: placeId,
          place_label_id: selectedGroup.id,
          latitude: latitude,
          longitude: longitude,
        },
      },
      {
        onSuccess: () => {
          toast.success("ذخیره مکان با موفقیت انجام شد");
          setSaveLocationPopup(false);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مکان ذخیره نشد مجددا تلاش کنید.");
          }
        },
      },
    );
  };

  //api taghire gooroohe location
  const { mutate: changeGroup, isLoading: isChangingLocationGroup } =
    usePatchRequest();
  const changeLocationGroup = (placeId, selectedGroup) => {
    changeGroup(
      {
        url: `/profiles/me/saved/location`,
        data: {
          id: locationCurrnetGroup.id,
          note: "",
          name: "",
          place_label_id: selectedGroup.id,
        },
      },
      {
        onSuccess: () => {
          toast.success("تغییر گروه با موفقیت انجام شد");
          setSaveLocationPopup(false);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("تغییر گروه موفقیت آمیز نبود، مجددا تلاش کنید");
          }
        },
      },
    );
  };

  const handleGroupClick = (placeId, selectedGroup) => {
    if (!locationCurrnetGroup) {
      addLocationToGroup(placeId, selectedGroup);
    } else if (locationCurrnetGroup.place_label_id !== selectedGroup.id) {
      changeLocationGroup(placeId, selectedGroup);
    }
  };

  // api1 gereftane group haye user
  const {
    mutate: fetchGroups,
    data: Groups,
    isPending: isFetchingGroups,
    error: fetchGroupsError,
  } = useGetRequest();
  useEffect(() => {
    fetchGroups(
      {
        endpoint: "profiles/me/saved/label",
        params: {},
      },
      {
        onSuccess: (data) => {
          setGroups(data.labels);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("گروه ها دریافت نشدند");
          }
        },
      },
    );
  }, [refetchGroups]);

  return (
    <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
      {showNewGroupForm && (
        <AddNewBookmarkGroupForm
          setShowNewGroupForm={setShowNewGroupForm}
          setRefetchGroups={setRefetchGroups}
          refetchGroups={refetchGroups}
        />
      )}
      <div className="relative pt-8 bg-white px-8 py-5 rounded-lg shadow-lg w-1/3 max-w-[400px] min-w-[200px]">
        <XCircle
          className="absolute left-4 top-4
                        text-gray-900
                        hover:cursor-pointer hover:text-red-500 transition-colors"
          onClick={() => setSaveLocationPopup(false)}
        />
        <span className="text-gray-900 text-xl">
          گروه مورد نظر را انتخاب کنید:
        </span>
        {isFetchingCurrentGroup || isFetchingGroups ? (
          <div className="text-gray-400 mt-2">در حال بارگیری گروه ها ...</div>
        ) : (
          <div
            className="flex flex-col items-center
                          justify-start overflow-x-hidden overflow-y-scroll
                          scrollbar-hide max-h-56 mt-2"
          >
            {groups.length === 0 && (
              <span className="text-gray-400 w-full mb-3 p-2">
                گروهی وجود ندارد
              </span>
            )}
            {groups.map((group, index) => (
              <div
                key={group.id}
                className="flex items-center justify-right
                              w-full hover:bg-gray-300 rounded-lg"
              >
                <button
                  className="flex flex-row justify-start
                                  bg-transparent p-0 w-full
                                  focus:outline-none items-start
                                  border-none"
                  onClick={() => handleGroupClick(placeId, group)}
                >
                  <div
                    className="flex flex-row items-center justify-right
                                    p-2 gap-y-4 float-left"
                  >
                    {/* {group.id === 1 && <Heart size={20} color="#7C3AED" iconStyle="Outline" />}
                        {group.id === 2 && <Flag size={20} color="#7C3AED" iconStyle="Outline" />}
                        {group.id === 3 && <SuitcaseLines size={20} color="#7C3AED" iconStyle="Outline" />} */}
                    {group.id > 0 && (
                      <PinCircle
                        size={20}
                        color="#7C3AED"
                        iconStyle="Outline"
                      />
                    )}
                    <span
                      className="text-gray-900 text-right
                                          px-3"
                    >
                      {group.name}
                    </span>
                    {locationCurrnetGroup &&
                      group.id === locationCurrnetGroup.place_label_id && (
                        <div>
                          <CheckIcon className="text-gray-900" />
                        </div>
                      )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center w-full">
          <button
            className="bg-white border-none focus:outline-none 
                                text-purple-600 p-2 float-left
                                text-base"
            onClick={handleMakeNewGroupClick}
          >
            ایجاد گروه جدید
          </button>
        </div>
      </div>
    </div>
  );
}
