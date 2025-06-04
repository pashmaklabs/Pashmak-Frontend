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
    <div className="h-screen w-screen flex justify-right items-right">
      <Helmet>
        <title>پروفایل</title>
      </Helmet>
      {isLoading ? (
        <div>loading... </div>
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
          {state === "myComments" && <MyComments />}
          {state === "favoriteLocations" && <FavoriteLocations />}
          <ProfileNavbar setState={setState} state={state} user={user} />
        </>
      )}
    </div>
  );
};

export default Profile;
