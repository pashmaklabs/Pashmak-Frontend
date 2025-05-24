import { useCallback, useEffect, useState, useRef } from "react";
import UserComment from "./UserComment";
import CommentSubmitForm from "./CommentSubmitForm";
import { useGetRequest } from "../services/api";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CommentsList = (props) => {
  const location = new URLSearchParams(useLocation().search);
  const locationId = location.get("id");
  const [refetchComments, setRefetchComments] = useState(false);
  const {
    mutate: getComments,
    data: commentsList,
    isPending: isGettingResult,
    error: error,
  } = useGetRequest();
  const {
    mutate: fetchMoreComments,
    data: moreComments,
    isPending: isGettingMore,
    error: errorLoadMore,
  } = useGetRequest();
  const [comments, setComments] = useState(commentsList || []);
  const [hasNext, setHasNext] = useState(false);
  const [nextPagePointer, setNextPagePointer] = useState("");
  const scrollRef = useRef(null);

  const getMoreComments = useCallback((nextPageKey) => {
    fetchMoreComments(
      { endpoint: `/comments/${locationId}`, params: { cursor: nextPageKey } },
      {
        onSuccess: (data) => {
          console.log(data);
          setHasNext(data.Pagination.hasNext);
          setNextPagePointer(data.Pagination.next);
          setComments((prev) => [...prev, ...data.comments]);
        },
        onError: () => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("ای بابا نشد که edamash:(");
          }
        },
      },
    );
  });

  useEffect(() => {
    getComments(
      { endpoint: `/comments/${locationId}`, params: {} },
      {
        onSuccess: (data) => {
          console.log(data);
          setHasNext(data.Pagination.hasNext);
          setNextPagePointer(data.Pagination.next);
          setComments(data.comments);
        },
        onError: () => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("ای بابا نشد که :(");
          }
        },
      },
    );
  }, [refetchComments]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight) {
      if (hasNext) getMoreComments(nextPagePointer);
    }
  };

  return (
    <>
      {!props.showCommentForm && isGettingResult && (
        <div className="flex flex-col justify-center items-center w-full p-2 float-center">
          <span className="text-gray-900 text-3xl ">دریافت نظرات...</span>
        </div>
      )}
      {!isGettingResult && props.showCommentForm && (
        <CommentSubmitForm
          showCommentForm={props.showCommentForm}
          setShowCommentForm={props.setShowCommentForm}
          comments={comments}
          setComments={setComments}
          locationId={locationId}
          setRefetchComments={setRefetchComments}
          refetchComments={refetchComments}
        />
      )}
      {!isGettingResult &&
        !props.showCommentForm &&
        (error || comments.length === 0 ? (
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
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full space-y-4 p-0 w-full
                      overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden"
          >
            {comments.map(
              (comment, index) =>
                comment.content.length > 0 && (
                  <div key={comment.id}>
                    <UserComment comment={comment} />
                  </div>
                ),
            )}
            {!props.showCommentForm && isGettingMore && (
              <div className="flex flex-col justify-center items-center w-full p-2 float-center">
                <span className="text-gray-900 text-3xl ">
                  دریافت نظرات بیشتر...
                </span>
              </div>
            )}
          </div>
        ))}
    </>
  );
};

export default CommentsList;
