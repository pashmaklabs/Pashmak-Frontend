import { useState } from "react";
import StarRating from "./StarRating";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { toast } from "react-toastify";
import { usePostRequest } from "../services/api";

const UserComment = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikes || 0);
  const [isLiked, setIsLiked] = useState(comment.isLikedByCurrentUser);
  const [isDisliked, setIsDisliked] = useState(comment.isDislikedByCurrentUser);
  const [isReported, setIsReported] = useState(false);

  const fullText = comment.content;
  const displayedText = isExpanded ? fullText : fullText.slice(0, 80);
  const created_at = comment.created_at.slice(0, 10);
  const user = comment.user;
  const commentId = comment.id;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const { mutate: submitLike, isLoading: isSubmittingLike } = usePostRequest();
  const handleLike = () => {
    submitLike(
      {
        url: isLiked
          ? `/comments/${commentId}/reaction/remove`
          : `/comments/${commentId}/reaction/set`,
        data: isLiked ? {} : { reaction_type: 0 },
      },
      {
        onSuccess: () => {
          if (isLiked) setLikesCount((prev) => prev - 1);
          else {
            setLikesCount((prev) => prev + 1);
            if (isDisliked) {
              setDislikesCount((prev) => prev - 1);
              setIsDisliked(false);
            }
          }
          setIsLiked(!isLiked);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "مشکلی پیش آمده. دوباره تلاش کنید.",
          );
        },
      },
    );
  };

  const { mutate: submitDislike, isLoading: isSubmittingDislike } =
    usePostRequest();
  const handleDislike = () => {
    submitDislike(
      {
        url: isDisliked
          ? `/comments/${commentId}/reaction/remove`
          : `/comments/${commentId}/reaction/set`,
        data: isDisliked ? {} : { reaction_type: 1 },
      },
      {
        onSuccess: () => {
          if (isDisliked) setDislikesCount((prev) => prev - 1);
          else {
            setDislikesCount((prev) => prev + 1);
            if (isLiked) {
              setLikesCount((prev) => prev - 1);
              setIsLiked(false);
            }
          }
          setIsDisliked(!isDisliked);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "مشکلی پیش آمده. دوباره تلاش کنید.",
          );
        },
      },
    );
  };

  const handleReport = () => {
    setIsReported(true);
    toast.success("گزارش شما ثبت شد.");
  };

  return (
    <div
      dir="rtl"
      className="font-sans text-right w-full p-4 bg-white border-b border-gray-300 rounded-lg shadow-sm"
    >
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar_url}
            alt="avatar"
            className="rounded-full w-11 h-11 border-2 border-gray-200"
          />
          <div>
            <div className="font-bold text-gray-800 text-base">
              {user.first_name + " " + user.last_name}
            </div>
            <div className="text-xs text-gray-500">{created_at}</div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-2">
        <StarRating rating={comment.rating} reviews={0} />
      </div>

      {/* Comment Text */}
      <div className="text-[15px] text-gray-900 leading-7 mt-3 whitespace-pre-line">
        {displayedText}
        {fullText.length > 80 && !isExpanded && "…"}
      </div>

      {/* Expand Button */}
      {fullText.length > 80 && (
        <div className="text-center mt-2">
          <button
            onClick={toggleExpand}
            className="text-indigo-600 text-sm hover:underline"
          >
            {isExpanded ? "کمتر" : "بیشتر"}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 items-center mt-4 text-sm text-gray-600">
        {/* Report */}
        <button
          onClick={handleReport}
          disabled={isReported}
          className="flex items-center gap-1 hover:text-rose-500 bg-white border-0"
        >
          <Flag
            size={18}
            className={isReported ? "text-rose-500" : "text-gray-400"}
          />
          <span>{isReported ? "گزارش شد" : "گزارش"}</span>
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isSubmittingLike}
          className="flex items-center gap-1 hover:text-green-600 bg-white border-0"
        >
          <ThumbsUp
            size={18}
            className={isLiked ? "text-green-600" : "text-gray-400"}
          />
          <span>{likesCount}</span>
        </button>

        {/* Dislike */}
        <button
          onClick={handleDislike}
          disabled={isSubmittingDislike}
          className="flex items-center gap-1 hover:text-rose-500 bg-white border-0"
        >
          <ThumbsDown
            size={18}
            className={isDisliked ? "text-rose-500" : "text-gray-400"}
          />
          <span>{dislikesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default UserComment;
