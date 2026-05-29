import { memo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHistoryComponent from "../components/SearchHistory";
import routes from "../routes/Routes";
import useIsMobile from "../hooks/useIsMobile";
import { useDeleteRequest } from "../services/api";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const SearchHistory = ({
  searchWithHistory,
  setSearchWithHistory,
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const toggleHistoryPanel = () => {
    setExpanded(!expanded);
  };
  const closeSearchPanel = () => {
    navigate(routes.map);
  };

  const { mutate: deleteAllRequest, isPending: isDeleting } = useDeleteRequest();
  
    const onClearHistory = (setSearchHistory) => {
      deleteAllRequest(
        { url: `/profiles/me/search/history/clear` },
        {
          onSuccess: () => {
            setSearchHistory([]);
          },
          onError: (error) => {
            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("خطایی در حذف رخ داده. لطفا دوباره امتحان کنید");
              console.log(error)
            }
          },
        }
      );
    };

  const onSearchSelect = (query) => {
    navigate(routes.search)
    setSearchWithHistory(() => ({
      query:query,
      isSearching:true
    }))
  }
  return (
    <>
      <Helmet>
        <title>تاریخچه جستجو</title>
      </Helmet>
      {/* <button
        onClick={closeSearchPanel}
        className={`absolute  shadow-md w-9 h-9 top-2 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[21] hover:border-0
          ${expanded ? "sm:right-[480px] left-0 sm:left-auto rotate-0" : "sm:right-[90px] right-[20px] rotate-180"}`}
        aria-label="Collapse search results"
      >
        <img
          src="/closeWhiteBg.svg"
          className={`h-6 w-6 ${expanded ? "-mt-[15%]" : "-mt-[10%]"}`}
          alt="closeWhiteBg"
        />
      </button> */}

      <button
        onClick={closeSearchPanel}
        className={`absolute shadow-md w-9 h-9 top-2 transition-all duration-300 ease-in-out p-2 rounded-full hover:bg-gray-100 bg-white z-[22] hover:border-0
          ${isMobile ? "right-[calc(100vw-36px)] shadow-lg" : "sm:right-[480px]"}`}
        aria-label="Collapse search results"
      >
        <img src="/Close_round.svg" alt="Close_round" className="scale-125" />
      </button>
      {/* <div className={`transition-all bottom-0 duration-300 ease-in-out absolute sm:right-[var(--sidebar-width)] right-0 top-[200px] z-[10] bg-white shadow-lg  overflow-x-hidden overflow-y-auto`}> */}
      <div
        className={`z-[21] absolute bg-white shadow-md overflow-y-auto scroll-smooth scrollbar-hide overflow-x-hidden font-sans 
          sm:right-[77px] sm:top-2 sm:bottom-[var(--promptbar-height)] right-0 bottom-[var(--sidebar-width)] h-[calc(100vh-var(--sidebar-width))] sm:h-auto h-min-[calc(100vh-200px)] h-min-[calc(100vh)]
        transition-all duration-500
        ${expanded ? "sm:w-[400px] w-full  bg-white" : "w-4 sm:w-4 bg-zinc-100"}`}
        dir="rtl"
        style={{
          backgroundColor: expanded ? "#ffffff" : "#F3F3F4",
          borderRadius: "10px",
        }}
      >
        <SearchHistoryComponent
          onSearchSelect={onSearchSelect}
          onClearHistory={onClearHistory}
        />
      </div>
    </>
  );
};

export default memo(SearchHistory);