import { useEffect, useState } from "react";
import { UserRounded, Gallery, ChatLine, Bookmark } from "solar-icon-set";

export default function ProfileNavbar(props) {
  const [lastName, setLastName] = useState(props.user.lastname);
  const [firstName, setFirstName] = useState(props.user.firstname);
  const [profilePhoto, setProfilePhoto] = useState(props.user.profilephoto);
  useEffect(() => {
    setLastName(props.user.lastname);
    setFirstName(props.user.firstname);
    setProfilePhoto(props.user.profilephoto);
  }, [props.user]);
  return (
    <div className="flex-col h-full w-[30%] bg-white items-center justify-center border-gray-400 border-l-[1px]">
      <div className="relative w-full">
        <span className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-[#45454575] to-[#26262600] to-[30%]" />
        <img
          src={profilePhoto || "/profilePhotoPlaceholder.svg"}
          alt="profile_picture"
          className="w-full h-full"
        />
        <span className="absolute bottom-4 right-4 text-white text-lg font-bold text-right">
          {firstName + " " + lastName}
        </span>
      </div>
      <div>
        <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
          <button
            className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                          text-right hover:border-white focus:outline-none 
                          ${props.state === "profileInfo" ? "text-purple-600" : "text-gray-900"}`}
            onClick={() => props.setState("profileInfo")}
          >
            اطلاعات حساب کاربری
          </button>
          <div className="mr-[25px] mt-2">
            <UserRounded
              size={26}
              color={`${props.state === "profileInfo" ? "#7C3AED" : "#111827"}`}
              iconStyle="Outline"
            />
          </div>
          {props.state === "profileInfo" && (
            <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0" />
          )}
        </div>

        <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
          <button
            className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "gallery" ? "text-purple-600" : "text-gray-900"}`}
            onClick={() => props.setState("gallery")}
          >
            گالری
          </button>
          <div className="mr-[25px] ">
            <Gallery
              size={26}
              color={`${props.state === "gallery" ? "#7C3AED" : "#111827"}`}
              iconStyle="Outline"
            />
          </div>
          {props.state === "gallery" && (
            <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
          )}
        </div>

        <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
          <button
            className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
                        text-right hover:border-white focus:outline-none 
                        ${props.state === "myComments" ? "text-purple-600" : "text-gray-900"}`}
            onClick={() => props.setState("myComments")}
          >
            نظرات
          </button>
          <div className="mr-[25px] ">
            <ChatLine
              size={26}
              color={`${props.state === "myComments" ? "#7C3AED" : "#111827"}`}
              iconStyle="Outline"
            />
          </div>
          {props.state === "myComments" && (
            <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
          )}
        </div>

        <div className="flex w-full items-center justify-end p-1 mt-3 pr-0">
          <button
            className={`bg-white mt-2 p-1 pb-3 pr-3 w-full
              text-right hover:border-white focus:outline-none 
              ${props.state === "favoriteLocations" ? "text-purple-600" : "text-gray-900"}`}
            onClick={() => props.setState("favoriteLocations")}
          >
            مکان های مورد علاقه
          </button>
          <div className="mr-[25px] ">
            <Bookmark size={26} color={"#5DB313"} iconStyle="Outline" />
          </div>
          {props.state === "favoriteLocations" && (
            <span className="bg-purple-600 h-[40px] w-[14px] pr-0 rounded-tl-lg rounded-bl-lg p-0"></span>
          )}
        </div>
      </div>
    </div>
  );
}
