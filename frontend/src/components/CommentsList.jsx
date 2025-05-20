import { React, useEffect, useState } from "react";
import UserComment from "./UserComment";
import CommentSubmitForm from "./CommentSubmitForm";
import { useGetRequest } from "../services/api";

export default function CommentsList(props) {
  // const [comments,setComments]=useState([{user:{firstname:"آریا", lastname:"دوست خواه", profilePicture:"/profilePhotoPlaceholder.svg",numberOfComments:143},
  //   timeStamp:"1404/4/13",
  //   text:"در دل شب، نسیمی خنک از لابه‌لای شاخه‌های درختان می‌وزید و بوی خوش گل‌های وحشی را با خود می‌آورد. ماه کامل در آسمان می‌درخشید و سایه‌های مبهمی روی زمین نقش می‌بست. صدای جیرجیرک‌ها سکوت شب را پر کرده بود و گویی طبیعت در آرامشی دلنشین فرو رفته بود. در دوردست، نوری کم‌رنگ از چراغی خاموش‌نشده دیده می‌شد که نشانه‌ی حضور زندگی در دل این سکوت بی‌انتها بود.",
  //   rating:1,
  //   numberOfLikes:3,
  //   numberOfDislikes:5,
  //   attachedPhotos:['/hardcode_pp.jpg']},
  //   {user:{firstname:"آریا", lastname:"دوست خواه", profilePicture:"/profilePhotoPlaceholder.svg",numberOfComments:143},
  //   timeStamp:"1404/4/13",
  //   text:"good",
  //   rating:1.5,
  //   numberOfLikes:6,
  //   numberOfDislikes:23,
  //   attachedPhotos:[]},
  //   {user:{firstname:"آریا", lastname:"دوست خواه", profilePicture:"/profilePhotoPlaceholder.svg",numberOfComments:143},
  //   timeStamp:"1404/4/13",
  //   text:"good",
  //   rating:2,
  //   numberOfLikes:2,
  //   numberOfDislikes:1,
  //   attachedPhotos:[]},
  //   {user:{firstname:"آریا", lastname:"دوست خواه", profilePicture:"/profilePhotoPlaceholder.svg",numberOfComments:143},
  //   timeStamp:"1404/4/13",
  //   text:"good",
  //   rating:2.5,
  //   numberOfLikes:86,
  //   numberOfDislikes:97,
  //   attachedPhotos:[]},
  // {user:{firstname:"آریا", lastname:"دوست خواه", profilePicture:"/profilePhotoPlaceholder.svg",numberOfComments:143},
  //   timeStamp:"1404/4/13",
  //   text:"در دل شب، نسیمی خنک از لابه‌لای شاخه‌های درختان می‌وزید و بوی خوش گل‌های وحشی را با خود می‌آورد. ماه کامل در آسمان می‌درخشید و سایه‌های مبهمی روی زمین نقش می‌بست. صدای جیرجیرک‌ها سکوت شب را پر کرده بود و گویی طبیعت در آرامشی دلنشین فرو رفته بود. در دوردست، نوری کم‌رنگ از چراغی خاموش‌نشده دیده می‌شد که نشانه‌ی حضور زندگی در دل این سکوت بی‌انتها بو",
  //   rating:3,
  //   numberOfLikes:3,
  //   numberOfDislikes:2,
  //   attachedPhotos:[]}])
  const locationId = 1;
  const [comments, setComments] = useState([]);
  const { data, isLoading, error } = useGetRequest("locationComments", {
    url: `/comments/${locationId}`,
  });

  useEffect(() => {
    if (data) {
      setComments(data.comments || []);
    }
  }, [data]);
  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center items-center w-full p-2 float-center">
          <span className="text-gray-900 text-3xl ">دریافت نظرات بیشتر...</span>
        </div>
      )}
      {!isLoading && props.showCommentForm && (
        <CommentSubmitForm
          showCommentForm={props.showCommentForm}
          setShowCommentForm={props.setShowCommentForm}
          comments={comments}
          setComments={setComments}
        />
      )}
      {!isLoading &&
        !props.showCommentForm &&
        (error ? (
          /* Section 6: Comment Button */
          <div className="flex flex-col justify-center items-center gap-4 p-4">
            <p className="text-sm text-gray-600">
              نظری برای این مکان ثبت نشده است
            </p>
            <button
              className="w-[100px] py-1 bg-white border border-purple-500
                                     text-purple-500 text-sm rounded-lg 
                                      focus:outline-none focus:border-purple-500 hover:border-purple-500"
              onClick={props.handleSubmitCommentButton}
            >
              ثبت نظر
            </button>
          </div>
        ) : (
          <div className="h-full  overflow-y-scroll scrollbar-hide space-y-4 p-0 w-full">
            {comments.map(
              (comment, index) =>
                comment.content.length > 0 && (
                  <div key={index}>
                    <UserComment comment={comment} />
                  </div>
                ),
            )}
          </div>
        ))}
    </>
  );
}
