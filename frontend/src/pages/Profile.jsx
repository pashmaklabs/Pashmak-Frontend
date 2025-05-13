import { useState, useEffect } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm.jsx";
import ProfileNavbar from "../components/ProfileNavbar.jsx";
import Galley from "../components/Galley.jsx";
import MyComments from "../components/MyComments.jsx";
import FavoriteLocations from "../components/FavoriteLocations.jsx";
import { useGetRequest } from "../services/api.jsx";
import { toast } from "react-toastify";

const Profile = () => {
  const [reRender, setReRender] = useState(true);
  const [state, setState] = useState("profileInfo");
  const { data, isLoading, error, refetch } = useGetRequest("userProfile", {
    url: "/profiles/me",
  });
  const [user, setUser] = useState({
    firstname: "کاربر",
    lastname: "ناشناس",
    profilephoto: "/hardcode_pp.jpg",
  });

  useEffect(() => {
    if (data) {
      const newUser = {
        firstname: data.message.FirstName || "کاربر",
        lastname: data.message.LastName || "ناشناس",
        profilephoto: data.message.Avatar_url || "/profilePhotoPlaceholder.svg",
      };
      setUser(newUser);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [reRender, refetch]);

  useEffect(() => {
    if (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("مشکل بکه");
      }
    }
  }, [error]);

  return (
    <div className="h-screen w-screen flex justify-right items-right">
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
