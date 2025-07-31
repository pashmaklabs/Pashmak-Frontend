import { useState, useEffect, useCallback } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm.jsx";
import ProfileNavbar from "../components/ProfileNavbar.jsx";
import Galley from "../components/Galley.jsx";
import MyComments from "../components/MyComments.jsx";
import FavoriteLocations from "../components/FavoriteLocations.jsx";
import { useGetRequest } from "../services/api.jsx";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [reRender, setReRender] = useState(true);
  const [state, setState] = useState("profileInfo");
  const {
    mutate: fetchProfile,
    data,
    isPending: isLoading,
    error,
  } = useGetRequest();
  const {
    mutate: getProfilePhoto,
    profilePhotofetched,
    isPending: isFetchingProfilePhoto,
    profilePhotoError,
  } = useGetRequest();
  const [user, setUser] = useState({
    // FirstName: "کاربر",
    // LastName: "ناشناس",
    // Avatar_url: "/hardcode_pp.jpg",
    // score:0,
    // Email:""
  });

  useEffect(() => {
    fetchProfile(
      {
        endpoint: "/profiles/me",
        params: {},
      },
      {
        onSuccess: (data) => {
          setUser(data);
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("خطایی رخ داده. لطفا دوباره امتحان کنید");
          }
        },
      },
    );
  }, [reRender, fetchProfile]);

  return (
    <div className="absolute top-0 h-screen w-screen flex justify-right items-right ">
      <Helmet>
        <title>پروفایل</title>
      </Helmet>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full w-full bg-purple-50 bg-opacity-70 z-[11]">
          <div className="flex space-x-2">
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full"></span>
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full animation-delay-200"></span>
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full animation-delay-400"></span>
          </div>
          <p dir="rtl" className="mt-4 text-gray-500">
            در حال بارگذاری...
          </p>
        </div>
      ) : (
        <>
          {state === "profileInfo" && (
            <PersonalInfoForm
              user={user}
              reRender={reRender}
              setReRender={setReRender}
            />
          )}
          {state === "gallery" && <Galley />}
          {state === "myComments" && <MyComments user={user} />}
          {state === "favoriteLocations" && <FavoriteLocations />}
          <ProfileNavbar setState={setState} state={state} user={user} />
        </>
      )}
    </div>
  );
};

export default Profile;
