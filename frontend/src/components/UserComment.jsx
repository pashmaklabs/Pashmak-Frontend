import React, { useState } from "react";
import StarRating from "./StarRating";
import { Like, Dislike, DangerCircle } from "solar-icon-set";

const UserComment = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = props.comment.content;
  const created_at = props.comment.created_at.slice(0, 10);
  const dislikes = props.comment.dislikes;
  const likes = props.comment.likes;
  const rating = props.comment.rating;
  const user = props.comment.user;
  const displayedText = isExpanded ? fullText : fullText.slice(0, 40);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative font-sans text-right w-full  p-0 bg-white  border-b border-gray-400 pb-1">
      <div className="relative flex items-center justify-start my-2">
        {/* Profile picture */}
        <div className="flex justify-between ml-1 mr-2">
          <img
            src={user.avatar_url}
            className="rounded-full w-11 aspect-square border-2 border-gray-200"
          />
        </div>

        <div className="flex flex-col items-center justify-end ml-2 mr-1">
          {/* Username */}
          <div className="flex justify-between ">
            <span className="font-bold text-gray-900">
              {" "}
              {user.first_name + " " + user.last_name}{" "}
            </span>
          </div>
          {/* Stats */}
          {/* <div className="flex gap-4 text-gray-500 w-full ">
              <span className='text-right text-sm'>{props.comment.user.numberOfComments+' '+"نظر"}</span>
            </div> */}
        </div>

        {/* Date */}
        <span className="absolute left-0 text-sm text-gray-500 mx-2 my-2">
          {created_at}
        </span>
      </div>

      {/* Stars */}
      <div className="flex items-center justify-start ml-2 mt-2 mr-1">
        <StarRating rating={rating} reviews={0} />
      </div>

      {/* Comment text */}
      <div
        className={`text-right whitespace-pre-line mx-2 leading-6 mb-1 transition-all duration-300`}
      >
        <p className=" text-gray-900">
          {displayedText}
          {fullText.length > 40 && !isExpanded && "..."}
        </p>
      </div>

      {/* Footer - Only show if text is truncated */}
      {fullText.length > 40 && (
        <div className="text-left items-center justify-center w-full p-0">
          <button
            className="text-purple-400 rounded-none bg-white text-sm mt-1 hover:text-purple-600 border-none
                              focus:outline-none transition-colors w-full"
            onClick={toggleExpand}
          >
            {isExpanded ? "کمتر" : "بیشتر"}
          </button>
        </div>
      )}

      {/*like dislike report buttons*/}
      <div className="flex items-center justify-end">
        {/*like button*/}
        <div className="flex items-center mx-2 ">
          <button className="flex bg-white border-none focus:outline-none w-full p-0 items-center justify-center">
            <DangerCircle size={24} color={"#111827"} iconStyle="Outline" />
          </button>
        </div>
        <div className="flex items-center mx-2">
          {likes !== 0 && (
            <span className="text-xl text-gray-900 mt-1">{likes}</span>
          )}
          <button className="flex bg-white border-none focus:outline-none w-full p-0 items-center justify-center">
            <Dislike size={24} color="#111827" iconStyle="Outline" />
          </button>
        </div>
        <div className="flex items-center mx-2">
          {dislikes !== 0 && (
            <span className="text-xl text-gray-900 mt-1">{dislikes}</span>
          )}
          <button className="flex bg-white border-none focus:outline-none w-full p-0 items-center justify-center">
            <Like size={24} color="#111827" iconStyle="Outline" />
          </button>
        </div>
      </div>

      {/* photos section
        {props.comment.attachedPhotos.length>0 &&(
          <div className='flex justify-center items-center gap-3'>
            {
              props.comment.attachedPhotos.map((photo,index)=>(
                  <div  key={index}
                        className=''
                  >
                    <img className='w-[75px] aspect-square rounded-xl border-[1px] border-gray-400 hover:w-[200px]' src={photo}/>
                  </div>
                )
              )
            }
          </div>
        )} */}
    </div>
  );
};

export default UserComment;
