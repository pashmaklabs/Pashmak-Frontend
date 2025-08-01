import { XCircleIcon } from "lucide-react";
import { useState } from "react";
import { usePostRequest } from "../services/api";
import { toast } from "react-toastify";

export default function ReportCommentForm(props) {
  const [reportText, setReportText] = useState("");
  const { mutate: sendCommentReport, isLoading: isSendingReport } =
    usePostRequest();

  const handleReportSubmit = (reportText) => {
    console.log(props.reportedComment);
    sendCommentReport(
      {
        url: `/comments/${props.reportedComment.id}/report`,
        data: {
          reason: reportText,
        },
      },
      {
        onSuccess: () => {
          props.setShowReportPopup(false);
          toast.success("گزارش شما با موفقیت ارسال شد");
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("ارسال موفقیت آمیز نبود لطفا دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  return (
    <div className="z-[999] fixed inset-0 flex items-center justify-center bg-black/50">
      <div
        className="relative bg-white p-6 
                    rounded-3xl shadow-lg w-1/3
                    max-w-[400px] min-w-[200px]
                    flex flex-col items-center
                    justify-center space-y-2"
      >
        <div className="absolute top-3 left-3">
          <XCircleIcon
            className="text-gray-900 w-6 h-6
                        hover:cursor-pointer hover:text-red-500 transition-colors
                        duration-200"
            onClick={() => props.setShowReportPopup(false)}
          />
        </div>
        <div
          className="flex w-full items-center
                        justify-start text-right"
        >
          <span
            className="mb-3 font-normal text-black
                        text-2xl"
          >
            گزارش نظر
          </span>
        </div>
        <div
          className="flex items-center justify-center
                        w-full"
        >
          <textarea
            className="bg-transparent border-2 border-gray-300
                        rounded-lg w-full focus:outline-none
                        p-1 text-gray-900 resize-none
                        scrollbar-hide min-h-[100px] "
            placeholder="علت گزارش خود را توضیح دهید"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          ></textarea>
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            className={`px-4 py-2 text-white rounded-md border-none
                          ${reportText?.length === 0 ? "bg-primary/20" : "bg-primary/90 hover:bg-primary"} transition-colors duration-200`}
            onClick={(e) => {
              handleReportSubmit(reportText);
            }}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
