import { useEffect, useState } from "react";
import { useGetRequest } from "../services/api";
import UserComment from "./UserComment";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import routes from "../routes/Routes";

export default function MyComments({ user }) {
  const [comments, setComments] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    mutate: getComments,
    data: commentsList,
    isPending: isLoading,
    error: error,
  } = useGetRequest();

  useEffect(() => {
    getComments(
      {
        endpoint: "/comments/me",
        params: {},
      },
      {
        onSuccess: (data) => {
          const updatedUser = {
          ...user,
          first_name: user.FirstName,
          last_name: user.LastName,
          avatar_url: "./userProfilePlaceHolder.png",
        };

        const updatedComments = data.comments.map((comment) => ({
          ...comment,
          user: updatedUser, // Add transformed user object to each comment
        }));

        setComments(updatedComments);
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
  }, [getComments]);

  const navigateToPlaceDetail = (placeId) => {
    const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("id", placeId);
      navigate(`${routes.place}?${newSearchParams.toString()}`);
  };

  return (
    <div
      className="h-full space-y-4 p-0 w-full flex flex-col items-center justify-center
             lg:max-w-[calc(100%-400px)] bg-purple-50 bg-opacity-70 transition duration-300
             overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden relative z-[11]"
    >
      <div
        className="overflow-y-auto w-[60%] h-[100%] min-w-[500px] lg:w-[35%] lg:h-[75%] border-[1px] lg:shadow-lg lg:shadow-gray-300 lg:rounded-3xl rounded-3xl p-4  bg-white scrollbar-hide"
        dir="rtl"
      >
        {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full w-full bg-white bg-opacity-70 z-[11]">
          <div className="flex">
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full ml-1"></span>
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full animation-delay-200"></span>
            <span className="animate-bounce w-4 h-4 bg-gray-500 rounded-full animation-delay-400 mr-1"></span>
          </div>
          <p dir="rtl" className="mt-4 text-gray-500">در حال بارگذاری...</p>
        </div>
        ) : (
        <>
          {comments.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-4 p-10">
              <p className="text-md text-gray-600">
                 شما تا به حال نظری ثبت نکرده اید
              </p>
            </div>
          )}
          {comments.map(
            (comment, index) =>
              comment.content.length > 0 && (
                <>
                  <div
                  dir="rtl"
                  className=" bg-blue-50 h-8 flex items-center rounded-t-md cursor-pointer mt-4"
                  onClick={() => navigateToPlaceDetail(comment.place_id)}
                >
                  <img src="./reply.svg" className="w-6 h-6 mr-2 mt-1 " />
                  <span className="text-gray-500 text-sm mr-1 ">
                    {comment.place_name}
                  </span>
                </div>
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-b-md mb-4"
                >
                  <UserComment comment={comment} />
                </div>
              </>
            )
        )}
        </>
        )}
      </div>
    </div>
  );
}
