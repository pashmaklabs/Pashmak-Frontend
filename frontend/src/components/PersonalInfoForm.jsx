import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { Camera } from "solar-icon-set";
import { usePostRequest } from "../services/api";

const PersonalInfo = (props) => {
  let default_firstname = props.user.FirstName;
  const [firstname, setFirstname] = useState(default_firstname);
  const [firstNameChanged, setFirstNameChanged] = useState(false);
  // hard code
  let default_lastname = props.user.LastName;
  const [lastname, setLastname] = useState(default_lastname);
  const [lastNameChanged, setLastNameChanged] = useState(false);

  //hard code
  let defaultProfilePicture = props.user.Avatar_url;
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [shownProfile, setShownProfile] = useState(defaultProfilePicture);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);

  //hard code
  const rating = 3;
  const percentage = (rating / 5) * 360;

  const [submited, setSubmited] = useState(false);

  const navigate = useNavigate();

  const { mutate: changeProfilePhoto, isLoading: isUploading } =
    usePostRequest();

  const { mutate: changeProfile, isLoading: isChanging } = usePostRequest();

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    changeProfilePhoto(
      {
        url: "/profiles/avatar/upload",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      },
      {
        onSuccess: (data) => {
          toast.success("تصویر با موفقیت آپلود شد");
          props.setReRender(!props.reRender);
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    changeProfile(
      {
        url: "/profiles/me/update",
        data: {
          firstname: firstname,
          lastname: lastname,
        },
      },
      {
        onSuccess: () => {
          toast.success("تغییرات حساب کاربری شما با موفقیت اعمال شد✅");
          props.setReRender(!props.reRender);
        },
        onError: (error) => {
          console.error("خطا در تغییر اطلاعات حساب کاربری:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const handleNameChange = (e, setter) => {
    const value = e.target.value;
    if (/^[\u0600-\u06FFa-zA-Z\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handleChangePasswordClick = () => {
    navigate(routes.changePassword);
  };

  const handleDiscardChangesClick = (e) => {
    e.preventDefault();
    setFirstname(default_firstname);
    setLastname(default_lastname);
    setProfilePicture(defaultProfilePicture);
  };

  const handlePhotoChange = (e) => {
    const profilePicture = e.target.files[0];
    if (profilePicture.type.startsWith("image/")) {
      uploadImage(profilePicture);
    }
    if (profilePicture) {
      const imageUrl = URL.createObjectURL(profilePicture);
      setShownProfile(imageUrl);
    }
    setProfilePicture(profilePicture);
  };

  useEffect(() => {
    if (firstname !== default_firstname) {
      setFirstNameChanged(true);
    } else {
      setFirstNameChanged(false);
    }
    if (lastname !== default_lastname) {
      setLastNameChanged(true);
    } else {
      setLastNameChanged(false);
    }
    if (profilePicture !== defaultProfilePicture) {
      setProfilePictureChanged(true);
    } else {
      setProfilePictureChanged(false);
    }
    setSubmited(false);
  }, [firstname, lastname, profilePicture]);

  return (
    <form
      className="flex flex-col items-center justify-center
                         h-full w-full max-w-[77%] bg-white"
    >
      <div
        className="flex flex-col items-center justify-center 
                      w-[40%] h-[70%] 
                      border-[1px] border-gray-700
                      rounded-3xl bg-white p-2"
      >
        <div className="flex items-center justify-center w-full pt-0 h-[35%] gap-x-[10%]">
          <div className="relative w-[20%] flex items-center justify-center">
            <div className="absolute w-full aspect-square rounded-full border-8 border-gray-700" />

            <div
              className="absolute w-full aspect-square rounded-full"
              style={{
                background: `conic-gradient(#facc15 ${percentage}deg, transparent 0deg)`,
                WebkitMask: "radial-gradient(white 60%, transparent 61%)",
                mask: "radial-gradient(white 60%, transparent 61%)",
              }}
            />

            <div
              className="flex justify-center items-center 
                            absolute w-[76%] min-w-13 
                            aspect-square bg-white rounded-full"
            >
              <span
                className="text-center relative text-base
                                w-[50%] min-w-16 font-bold text-gray-900"
              >
                {rating.toFixed(1)} / 5
              </span>
            </div>
          </div>

          <div className="relative flex w-[50%] max-w-[200px] justify-center">
            <img
              src={shownProfile || "./profilePhotoPlaceholder.svg"}
              alt="User"
              className="rounded-full w-full max-w-[200px] aspect-square border-gray-400 border-[2px]"
            />
            <div className="">
              <label className="absolute bottom-[2px] left-1/2 -translate-x-1/2 bg-gray-200 pt-[6px] px-[6px] pb-0 rounded-full shadow cursor-pointer hover:bg-gray-300 transition">
                <Camera size={25} color="#111827" iconStyle="Outline" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="w-[80%] relative mt-[20px] ">
          <input
            placeholder="نام"
            value={firstname || ""}
            onChange={(e) => handleNameChange(e, setFirstname)}
            dir="rtl"
            className="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                                    text-gray-900 placeholder:text-right focus:outline-none focus:border-primary"
          />
        </div>

        <div className="w-[80%] relative mt-[20px]">
          <input
            placeholder="نام خانوادگی"
            value={lastname || ""}
            onChange={(e) => handleNameChange(e, setLastname)}
            dir="rtl"
            className={`w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                            text-secondary placeholder:text-right focus:outline-none focus:border-primary`}
          />
        </div>

        <div className="w-[80%] relative mt-[20px]">
          <button
            onClick={handleChangePasswordClick}
            className={`w-full py-2 rounded-md 
                        text-white transition duration-300 
                        text-sm sm:text-base bg-primary
                        hover:bg-blue-700`}
          >
            تغییر رمز عبور
          </button>
        </div>

        <div className="flex gap-3 w-[80%] mx-auto mt-[20px]">
          <button
            onClick={handleDiscardChangesClick}
            disabled={
              !firstNameChanged && !lastNameChanged && !profilePictureChanged
            }
            className={`w-[42.85%] py-2 rounded-md
                      text-gray-700 bg-gray-400
                      text-sm sm:text-base border-zinc-700 border-[1px]`}
          >
            لغو
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              (!firstNameChanged &&
                !lastNameChanged &&
                !profilePictureChanged) ||
              submited
            }
            className={`w-full py-2 rounded-md
                        text-white focus:outline-none 
                        transition duration-300 text-sm sm:text-base ${
                          (!firstNameChanged &&
                            !lastNameChanged &&
                            !profilePictureChanged) ||
                          !firstname ||
                          !lastname ||
                          submited
                            ? "bg-slate-400"
                            : "bg-primary"
                        }`}
          >
            تایید تغییرات
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo;
