import { useState } from "react";
import { XCircle } from "lucide-react";
import { usePostRequest } from "../services/api";
import { toast } from "react-toastify";

export default function AddBookmarkGroupForm({
  setShowNewGroupForm,
  setRefetchGroups,
  refetchGroups,
}) {
  const [groupName, setGroupName] = useState("");

  //api2 ezafe kardane goroohe jadid
  const { mutate: addNewGroup, isLoading: isAddingNewGroup } = usePostRequest();
  const SubmitCreateGroupFrom = (e, groupName) => {
    e.preventDefault();
    console.log(groupName);
    addNewGroup(
      {
        url: "/profiles/me/saved/label",
        data: {
          name: groupName,
        },
      },
      {
        onSuccess: (data) => {
          console.log(data);
          toast.success("گروه جدید ساخته شد.");
          setShowNewGroupForm(false);
          setRefetchGroups(!refetchGroups);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(".گروه ساخته نشد لطفا مجددا تلاش کنید");
          }
        },
      },
    );
  };

  const handleCloseButton = () => {
    setShowNewGroupForm(false);
  };

  return (
    <>
      <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="relative bg-white px-8 py-5 rounded-lg shadow-lg w-1/3 max-w-[400px] min-w-[200px]">
          <XCircle
            className="absolute left-4 top-4
                            text-gray-900
                            hover:cursor-pointer hover:text-red-500 transition-colors"
            onClick={handleCloseButton}
          />
          <div className="flex flex-row items-center justify-start text-right">
            <div className="flex items-center justify-center pb-11">
              <p className="h-full text-center text-3xl leading-9 font-normal text-black">
                گروه جدید
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <input
              type="text"
              placeholder="نام گروه"
              value={groupName}
              dir="rtl"
              onChange={(e) => {
                if (e.target.value.length <= 40) setGroupName(e.target.value);
              }}
              className="w-full text-right p-2
                                mb-8 rounded-lg bg-white
                                border-gray-300 border text-gray-900
                                focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={groupName.length === 0}
              onClick={(e) => SubmitCreateGroupFrom(e, groupName)}
              className="bg-purple-600 text-white text-base
                                    py-2 px-4 leading-6
                                    disabled:bg-slate-300 transition-colors duration-150
                                    rounded-full border-none"
            >
              ساخت گروه
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
