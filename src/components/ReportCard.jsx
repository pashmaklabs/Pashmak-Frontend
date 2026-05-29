import { usePostRequest } from "../services/api";
import { toast } from "react-toastify";

const ReportCard = ({ report, onUpdate, isUpdating }) => {
  const { mutate: updateReportStatus, isLoading } = usePostRequest();

  const handleAction = (newStatus) => {
    updateReportStatus(
      {
        url: `/admin/reported-comments/${report.id}`,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          const message =
            newStatus === "Resolved" ? "گزارش تایید شد." : "گزارش رد شد.";
          toast.success(message);
          onUpdate(report.id, newStatus);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "خطایی رخ داد");
        },
      },
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start">
        <img
          src={
            report.comment.user.avatar_url ||
            `https://i.pravatar.cc/48?u=${report.comment.user.id}`
          }
          alt="Avatar"
          className="w-12 h-12 rounded-full ml-4 object-cover"
        />
        <div className="flex-1 text-right">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              {report.comment.user.first_name} {report.comment.user.last_name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            در مکان:{" "}
            <span className="font-semibold">{report.comment.PlaceName}</span>
          </p>
          <p className="text-gray-700 my-2 p-3 bg-gray-50 rounded-md">
            &ldquo;{report.comment.content}&ldquo;
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">دلیل گزارش:</span> {report.reason}
          </p>
        </div>
      </div>

      {report.status === "Pending" && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2 space-x-reverse">
          <button
            onClick={() => onUpdate(report, "Dismissed")}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {isUpdating ? "..." : "رد کردن گزارش"}
          </button>
          <button
            onClick={() => onUpdate(report, "Resolved")}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? "..." : "تایید گزارش"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
