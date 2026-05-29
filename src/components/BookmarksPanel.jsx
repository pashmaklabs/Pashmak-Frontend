import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Heart, Flag, SuitcaseLines, PinCircle } from "solar-icon-set";
import { Trash2Icon } from "lucide-react";
import AddNewBookmarkGroupForm from "./AddBookmarkGroupForm";
import {
  useGetRequest,
  usePostRequest,
  useDeleteRequest,
} from "../services/api";
import { toast } from "react-toastify";

const BookmarksPanel = ({ setState, setSelectedGroup }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [refetchGroups, setRefetchGroups] = useState(false);
  const [deleteNonEmptyGroupWarning, setDeleteNonEmptyGroupWarning] =
    useState(false);
  const [candidateGroupToDelete, setCandidateGroupToDelete] = useState(null);

  //api3 delete kardane ye goooroohe location ha
  const { mutate: deleteGroup, isPending: isdeletingGroups } =
    useDeleteRequest();

  const handleTrashClick = (e, deletedItem) => {
    e.stopPropagation();
    if (deletedItem.saved_locations_count > 0 && !deleteNonEmptyGroupWarning) {
      setCandidateGroupToDelete(deletedItem);
      setDeleteNonEmptyGroupWarning(true);
    } else {
      deleteGroup(
        {
          url: `/profiles/me/saved/label/${deletedItem.id}`,
        },
        {
          onSuccess: () => {
            toast.success("گروه با موفقیت حذف شد.");
            setRefetchGroups(!refetchGroups);
            setDeleteNonEmptyGroupWarning(false);
          },
          onError: (error) => {
            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("گروه حذف نشد. مجددا تلاش کنید.");
            }
          },
        },
      );
    }
  };

  // api1 gereftane group haye location
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
          setResults(data.labels);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("گروه ها گرفته نشدند");
          }
        },
      },
    );
  }, [refetchGroups]);

  const handleMakeNewGroupClick = () => {
    setShowNewGroupForm(true);
  };

  const handlePlaceSelect = (group) => {
    setSelectedGroup(group);
    const params = new URLSearchParams(location.search);
    params.set("group", group.name);
    navigate(`${location.pathname}?${params.toString()}`);
    setState("selectedGroupPanel");
  };
  console.log(results);
  return (
    <>
      {/* Make New Group Form */}
      {showNewGroupForm && (
        <AddNewBookmarkGroupForm
          setShowNewGroupForm={setShowNewGroupForm}
          setRefetchGroups={setRefetchGroups}
          refetchGroups={refetchGroups}
        />
      )}

      {deleteNonEmptyGroupWarning && (
        <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="relative bg-white px-8 py-5 rounded-lg shadow-lg w-1/3 max-w-[400px] min-w-[200px] space-y-2">
            <div className="">
              <label className="text-text ">
                این گروه خالی نیست. آیا از حذف آن اطمینان دارید؟
              </label>
            </div>

            <div className="flex justify-center gap-2 w-full ">
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 rounded-md border-none
                            hover:bg-gray-500 transition-colors duration-200"
                onClick={() => setDeleteNonEmptyGroupWarning(false)}
              >
                انصراف
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white rounded-md border-none
                          bg-primary/90 hover:bg-primary transition-all duration-200"
                onClick={(e) => handleTrashClick(e, candidateGroupToDelete)}
              >
                بله
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel header */}
      <div className="flex-shrink-0 pt-2 px-4 relative shadow-md mb-2">
        <div className="flex justify-center items-center w-full">
          <h1 className="text-3xl font-normal text-gray-800 float-right w-[50%] p-2 leading-10">
            گروه ها
          </h1>
          <div className="flex justify-end items-center w-[50%]">
            <button
              className="bg-white border-none focus:outline-none 
                              text-primary p-2 float-left
                              text-base"
              onClick={handleMakeNewGroupClick}
            >
              ایجاد گروه جدید
            </button>
          </div>
        </div>
      </div>

      {/* Results content */}
      <div className="flex-grow overflow-y-auto px-4 scrollbar-hide">
        {isFetchingGroups ? (
          <p className="text-gray-500 text-center py-4">در حال بارگذاری...</p>
        ) : results.length > 0 ? (
          <div className="space-y-1 pb-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-right
                          cursor-pointer rounded-xl hover:bg-gray-100 
                          transition-colors py-2 relative
                          z-10"
                onClick={() => handlePlaceSelect(item)}
              >
                {/*Group Icon */}
                <div className="flex items-center pl-4 pr-2 justify-center">
                  {item.id > 0 && (
                    <PinCircle size={24} color="#4361EE" iconStyle="Outline" />
                  )}
                </div>
                {/*group name */}
                <div className="flex flex-col items-start justify-center">
                  <span
                    className="font-normal text-lg text-gray-900
                              "
                  >
                    {item.name}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {item.saved_locations_count} مکان
                  </span>
                </div>
                {/*delete button*/}
                {item.id > 0 && (
                  <button
                    className="flex items-center justify-center
                                  bg-transparent border-hidden focus:outline-none 
                                  absolute left-0
                                  p-0 w-[40px] aspect-square z-20"
                    onClick={(e) => handleTrashClick(e, item)}
                  >
                    <Trash2Icon className="w-6 h-6 text-primary hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">نتیجه‌ای یافت نشد</p>
        )}
      </div>
    </>
  );
};

BookmarksPanel.propTypes = {
  setExpendSearch: PropTypes.func.isRequired,
  expendSearch: PropTypes.bool.isRequired,
};

export default BookmarksPanel;
