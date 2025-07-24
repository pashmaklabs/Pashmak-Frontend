import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify"; // برای نمایش پیام موفقیت یا خطا
import apiClient from "../services/api";
import ReportCard from "../components/ReportCard";

const initialTabState = { list: [], paginator: null, hasMore: true };
const initialDataState = {
  Pending: { ...initialTabState },
  Resolved: { ...initialTabState },
  Dismissed: { ...initialTabState },
};

const CommentReports = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [reportsData, setReportsData] = useState(initialDataState);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const observer = useRef();

  const fetchReports = useCallback(
    async (status, cursor = "") => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const params = { status, limit: 10 };
        if (cursor) {
          params.cursor = cursor;
        }
        const { data } = await apiClient.get("/admin/reported-comments", {
          params,
        });
        setReportsData((prevData) => {
          if (!prevData[status].hasMore && cursor) return prevData;
          return {
            ...prevData,
            [status]: {
              list: cursor
                ? [...prevData[status].list, ...data.reports]
                : data.reports,
              paginator: data.paginator,
              hasMore: data.paginator?.PageInfo?.hasNext ?? false,
            },
          };
        });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReportsData((prev) => ({
          ...prev,
          [status]: { ...prev[status], hasMore: false },
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  useEffect(() => {
    const currentTab = reportsData[activeTab];
    if (currentTab.list.length === 0 && currentTab.hasMore) {
      fetchReports(activeTab);
    }
  }, [activeTab, fetchReports, reportsData]);

  const lastReportElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const currentTab = reportsData[activeTab];
        if (entries[0].isIntersecting && currentTab.hasMore) {
          const nextCursor = currentTab.paginator?.PageInfo?.next;
          if (nextCursor) {
            fetchReports(activeTab, nextCursor);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, fetchReports, activeTab, reportsData],
  );

  const handleUpdateReport = async (reportToUpdate, newStatus) => {
    setUpdatingId(reportToUpdate.id);
    try {
      await apiClient.post(`/admin/reported-comments/${reportToUpdate.id}`, {
        status: newStatus,
      });

      setReportsData((prev) => {
        const newPendingList = prev.Pending.list.filter(
          (r) => r.id !== reportToUpdate.id,
        );

        const newDestinationList = [
          { ...reportToUpdate, status: newStatus },
          ...prev[newStatus].list,
        ];

        return {
          ...prev,
          Pending: {
            ...prev.Pending,
            list: newPendingList,
          },
          [newStatus]: {
            ...prev[newStatus],
            list: newDestinationList,
          },
        };
      });

      toast.success("وضعیت گزارش با موفقیت به‌روزرسانی شد.");
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("خطا در به‌روزرسانی گزارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setUpdatingId(null);
    }
  };

  const currentList = reportsData[activeTab].list;

  return (
    <div>
      <Helmet>
        <title>گزارش کامنت‌ها</title>
      </Helmet>


      <div className="flex justify-center mb-6">
        <nav className="flex w-full max-w-md space-x-1 space-x-reverse rounded-full bg-gray-200 p-1.5">
          {["Pending", "Resolved", "Dismissed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab ? "bg-white text-gray-800 shadow-md" : "text-gray-600 hover:text-black"} w-full rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none`}
            >
              {tab === "Pending"
                ? "در انتظار بررسی"
                : tab === "Resolved"
                  ? "تایید شده"
                  : "رد شده"}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {currentList.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 py-10">
            موردی برای نمایش وجود ندارد.
          </p>
        )}

        {currentList.map((report, index) => (
          <div
            ref={currentList.length === index + 1 ? lastReportElementRef : null}
            key={report.id}
          >
            <ReportCard
              report={report}
              onUpdate={handleUpdateReport}
              isUpdating={updatingId === report.id}
            />
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 py-4">
          در حال بارگذاری موارد بیشتر...
        </p>
      )}
    </div>
  );
};

export default CommentReports;
