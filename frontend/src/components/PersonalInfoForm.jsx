import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { Camera } from "solar-icon-set";
import { usePostRequest } from "../services/api";
import ChangePassword from "../pages/ChangePassword";

const PersonalInfo = (props) => {
  const isChangePassword = location.pathname.includes(routes.changePassword);
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
                h-full w-full  lg:max-w-[calc(100%-400px)]
                bg-purple-50 bg-opacity-70 transition duration-300 z-[11]"
    >
      {isChangePassword ? (
        <ChangePassword />
      ) : (
        <div
          className="flex flex-col items-center justify-center
                    lg:w-[35%] lg:h-auto  sm:w-[50%] min-w-[400px] 
                    sm:h-auto w-[100%] h-[100%] border-[1px] sm:shadow-lg
                    sm:shadow-gray-300 sm:rounded-3xl bg-white p-2
                     overflow-auto  scrollbar-hide z-[11] "
        >
          <div className="flex items-center justify-center p-10 gap-x-[20%]">
            {/* <div className="relative min-w-16 flex items-center justify-center"> */}
            {/* <div className="absolute w-full aspect-square rounded-full border-8 border-gray-100" /> */}

            {/* <div
              className="absolute w-full aspect-square rounded-full "
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
                className="text-center relative text-sm
                                w-[50%] min-w-16 font-bold text-gray-900"
              >
                {toPersianDigits(rating.toFixed(1))} / {toPersianDigits(5)}
              </span>
            </div> */}
            {/* </div> */}

            <div className="relative flex min-w-40 min-h-40  justify-center">
              <img
                src={shownProfile || "./userProfilePlaceHolder2.png"}
                alt="User"
                className="rounded-full mt-2 min-w-[100px] max-w-[200px] aspect-square border-gray-400 border-[2px] object-cover"
              />
              <div className="">
                <label className="absolute bottom-[4%] left-1/2 -translate-x-1/2 bg-gray-200 pt-[6px] px-[6px] pb-0 rounded-full shadow cursor-pointer hover:bg-gray-300 transition">
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

          <div className="w-[70%] relative ">
            <input
              placeholder="نام"
              value={firstname || ""}
              onChange={(e) => handleNameChange(e, setFirstname)}
              dir="rtl"
              className="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                                    text-gray-900 placeholder:text-right focus:outline-none focus:border-primary"
            />
          </div>

          <div className="w-[70%] relative mt-[30px]">
            <input
              placeholder="نام خانوادگی"
              value={lastname || ""}
              onChange={(e) => handleNameChange(e, setLastname)}
              dir="rtl"
              className={`w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400
                            text-secondary placeholder:text-right focus:outline-none focus:border-primary`}
            />
          </div>

          <div className="w-[60%] relative mt-[30px]">
            <button
              onClick={handleChangePasswordClick}
              className={`w-full py-2 rounded-md 
                        text-blue-400 transition duration-300 
                        text-sm sm:text-base bg-white border-blue-400 border-2
                        hover:bg-blue-400 hover:text-white hover:border-blue-400`}
            >
              تغییر رمز عبور
            </button>
          </div>

          <div className="flex gap-3 w-[70%] mx-auto mt-[15%] pb-10">
            <button
              onClick={handleDiscardChangesClick}
              disabled={
                !firstNameChanged && !lastNameChanged && !profilePictureChanged
              }
              className={`w-[42.85%] max-h-10 py-2 rounded-md
                      text-white bg-slate-400
                      text-sm sm:text-base border-[1px]`}
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
              className={`w-full py-2 rounded-md max-h-10 
                        text-white focus:outline-none 
                        transition duration-300 text-sm sm:text-base ${
                          (!firstNameChanged &&
                            !lastNameChanged &&
                            !profilePictureChanged) ||
                          !firstname ||
                          !lastname ||
                          submited
                            ? "bg-blue-400"
                            : "bg-blue-500"
                        }`}
            >
              تایید تغییرات
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PersonalInfo;
