import { useState, useEffect } from "react";
import { Clock, Search, X, Trash2 } from "lucide-react";
import { useGetRequest } from "../services/api";
import { useDeleteRequest } from "../services/api";
import { toast } from "react-toastify";

const SearchHistory = ({ onSearchSelect, onClearHistory }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    mutate: fetchHistory,
    data: response,
    isPending,
    fetchError,
  } = useGetRequest();

  const fetchSearchHistory = () => {
    setLoading(true);
    fetchHistory(
      { endpoint: "profiles/me/search/history", params: {} },
      {
        onSuccess: (message) => {
          setSearchHistory(message?.history || []);
          // console.log(message)
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
    setLoading(false);
  };

  const { mutate: deleteRequest, isPending: isDeleting } = useDeleteRequest();

  const deleteSearchItem = (id) => {
    deleteRequest(
      { url: `/profiles/me/search/history/${id}` },
      {
        onSuccess: () => {
          setSearchHistory((prev) => prev.filter((item) => item.ID !== id));
        },
        onError: (error) => {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("خطایی در حذف رخ داده. لطفا دوباره امتحان کنید");
            console.log(error);
          }
        },
      },
    );
  };

  // Clear all search history
  const clearAllHistory = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onClearHistory) {
        onClearHistory(setSearchHistory);
      }
    } catch (err) {
      setError("خطا در پاک کردن تاریخچه");
    }
  };

  // Format timestamp to Persian
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "همین الان";
    } else if (diffInHours < 24) {
      return `${diffInHours} ساعت پیش`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} روز پیش`;
    }
  };

  const handleSearchSelect = (query) => {
    // console.log(query)
    if (onSearchSelect) {
      onSearchSelect(query);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 pt-2 px-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">تاریخچه جستجو</h1>
          {searchHistory.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="flex items-center ml-8 pt-4 gap-1 bg-transparent text-red-600 hover:text-red-800 text-sm transition-colors"
            >
              <Trash2 size={16} />
              پاک کردن همه
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto px-4 scrollbar-hide">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchSearchHistory}
              className="px-4 py-2 bg-blue-600 bg-transparent text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : searchHistory.length > 0 ? (
          <div className="space-y-3 pb-4">
            {searchHistory.slice().reverse().map((item) => ( (item.Query !== "") && (
              <div
                key={item.ID}
                className="relative rounded-xl bg-white transition-colors group hover:bg-gray-50"
              >
                {/* X Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSearchItem(item.ID);
                  }}
                  disabled={isDeleting}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all bg-transparent hover:border hover:border-none border border-none"
                >
                  <X
                    size={18}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  />
                </button>

                    {/* Main Content */}
                    <div
                      className="flex flex-row-reverse items-center p-4 cursor-pointer"
                      onClick={() => handleSearchSelect(item.Query)}
                    >
                      <div className="ml-6 mt-2 pt-2 p-2 bg-gray-100 rounded-lg">
                        <Search size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {item.Query}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatTimestamp(item.CreatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            )))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">تاریخچه جستجو خالی است</p>
            <p className="text-gray-400 text-sm">
              جستجوهای شما در اینجا نمایش داده خواهد شد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
