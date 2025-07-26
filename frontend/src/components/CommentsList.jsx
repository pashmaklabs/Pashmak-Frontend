import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import UserComment from "./UserComment";
import CommentSubmitForm from "./CommentSubmitForm";
import { useGetRequest } from "../services/api";

const CommentsList = ({
  showCommentForm,
  setShowCommentForm,
  handleSubmitCommentButton,
}) => {
  const locationId = new URLSearchParams(useLocation().search).get("id");

  const [refetchComments, setRefetchComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextPagePointer, setNextPagePointer] = useState("");

  const scrollRef = useRef(null);

  const {
    mutate: getComments,
    data: initialComments,
    isPending: isLoadingComments,
    error: initialError,
  } = useGetRequest();

  const {
    mutate: fetchMoreComments,
    isPending: isLoadingMore,
    error: loadMoreError,
  } = useGetRequest();

  const handleFetchSuccess = (data, append = false) => {
    console.log(data);
    setHasNext(data?.Pagination?.hasNext ?? false);
    setNextPagePointer(data?.Pagination?.next ?? "");

    if (append) {
      setComments((prev) => [...prev, ...(data?.comments ?? [])]);
    } else {
      setComments(data?.comments ?? []);
    }
  };

  const getMoreComments = useCallback(
    (cursor) => {
      fetchMoreComments(
        { endpoint: `/comments/${locationId}`, params: { cursor } },
        {
          onSuccess: (data) => handleFetchSuccess(data, true),
          onError: (error) => {
            const msg = error?.response?.data?.message ?? "ای بابا نشد که :(";
            toast.error(msg);
          },
        },
      );
    },
    [fetchMoreComments, locationId],
  );

  useEffect(() => {
    getComments(
      { endpoint: `/comments/${locationId}`, params: {} },
      {
        onSuccess: handleFetchSuccess,
        onError: (error) => {
          const msg = error?.response?.data?.message ?? "ای بابا نشد که :(";
          toast.error(msg);
        },
      },
    );
  }, [getComments, locationId, refetchComments]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollHeight - el.scrollTop <= el.clientHeight && hasNext) {
      getMoreComments(nextPagePointer);
    }
  };

  const renderNoComments = () => (
    <div className="flex flex-col justify-center items-center gap-4 p-4">
      <p className="text-sm text-gray-600">نظری برای این مکان ثبت نشده است</p>
      <button
        className="w-[100px] py-1 bg-white border border-purple-500 text-purple-500 text-sm rounded-lg 
                   focus:outline-none focus:border-purple-500 hover:border-purple-500"
        onClick={handleSubmitCommentButton}
      >
        ثبت نظر
      </button>
    </div>
  );

  const renderCommentsList = () => (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full space-y-4 p-0 w-full overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden"
    >
      {comments.map(
        (comment) =>
          comment?.content?.length > 0 && (
            <div key={comment.id}>
              <UserComment comment={comment} />
            </div>
          ),
      )}
      {isLoadingMore && (
        <div className="flex flex-col justify-center items-center w-full p-2 float-center">
          <span className="text-gray-900 text-3xl">دریافت نظرات بیشتر...</span>
        </div>
      )}
    </div>
  );

  if (showCommentForm && !isLoadingComments) {
    return (
      <CommentSubmitForm
        showCommentForm={showCommentForm}
        setShowCommentForm={setShowCommentForm}
        comments={comments}
        setComments={setComments}
        locationId={locationId}
        setRefetchComments={setRefetchComments}
        refetchComments={refetchComments}
      />
    );
  }

  if (isLoadingComments) {
    return (
      <div className="flex flex-col justify-center items-center w-full p-2 float-center">
        <span className="text-gray-900 text-3xl">دریافت نظرات...</span>
      </div>
    );
  }

  const hasNoComments = initialError || comments.length === 0;

  return hasNoComments ? renderNoComments() : renderCommentsList();
};

export default CommentsList;
