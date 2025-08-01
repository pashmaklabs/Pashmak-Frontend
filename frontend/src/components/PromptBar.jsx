import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import TagContainer from "./TagContainer";
import TagRenderer from "./TagRenderer";
import useIsMobile from "../hooks/useIsMobile";
import routes from "../routes/Routes";
import { useEmail, useUserLogin } from "../stores/login";
import { toast } from "react-toastify";
import { hasSemanticSearchAccess } from "../utils/auth";

export default function PromptBar({
  resetSearch,
  setResetSearch,
  fetchInitialTags,
  fetchSuggestedTags,
  submitData,
  expendSearch,
  setExpendSearch,
  searchWithHistory,
  setSearchWithHistory,
}) {
  const isMobile = useIsMobile();
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [searchMode, setSearchMode] = useState("normal");
  const { userLogin, setUserLogin } = useUserLogin();
  const { email, setEmail } = useEmail();
  // const [isSearching, setIsSearching] = useState(false);
  // const [isExpanded, setIsExpanded] = useState(false);
  const [PromptBarState, setPromptBarState] = useState("center"); // center - center-wide - right

  const promptBarRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();

  const iconVariants = {
    initial: { y: 5, opacity: 0 },
    animate: {
      y: -5,
      opacity: 1,
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6 },
    },
    exit: { y: 5, opacity: 0, rotate: 0, transition: { duration: 0.3 } },
  };

  const isSearchDisabled =
    inputPrompt.trim() === "" && selectedTags.length === 0;

  useEffect(() => {
    if (searchWithHistory.isSearching === true) {
      setInputPrompt(searchWithHistory.query);
      setSearchWithHistory((prev) => ({
        ...prev,
        isSearching: !prev.isSearching,
      }));
      setPromptBarState("right");
      setResetSearch(false);
      setExpendSearch(false);
      submitData({
        input: searchWithHistory.query,
        tags: selectedTags,
        agentic: searchMode === "agentic" ? true : false,
      });
      console.log(expendSearch);
      // console.log("in prompt")
      // console.log(searchWithHistory.isSearching)
      // console.log(searchWithHistory.query)
    }
  }, [searchWithHistory]);
  // useEffect(() => {
  //   if (searchWithHistory.isSearching === true) {
  //     setInputPrompt(searchWithHistory.query);
  //     setSearchWithHistory((prev) => ({
  //       ...prev,
  //       isSearching: !prev.isSearching,
  //     }));
  //     setPromptBarState("right");
  //     setResetSearch(false);
  //     setExpendSearch(false);
  //     submitData({ input: searchWithHistory.query, tags: selectedTags, agentic: searchMode==="agentic"? true : false });
  //     console.log(expendSearch);
  //     // console.log("in prompt")
  //     // console.log(searchWithHistory.isSearching)
  //     // console.log(searchWithHistory.query)
  //   }
  // }, [searchWithHistory]);

  useEffect(() => {
    if (searchWithHistory.isSearching === true) {
      setInputPrompt(searchWithHistory.query);
      setSearchWithHistory((prev) => ({
        ...prev,
        isSearching: !prev.isSearching,
      }));
      // setIsSearching(true);
      // setIsExpanded(true);
      setResetSearch(false);
      setExpendSearch(false);
      submitData({
        input: searchWithHistory.query,
        tags: selectedTags,
        agentic: searchMode === "agentic" ? true : false,
      });
      console.log(expendSearch);
      // console.log("in prompt")
      // console.log(searchWithHistory.isSearching)
      // console.log(searchWithHistory.query)
    }
  }, [searchWithHistory]);
  // useEffect(() => {
  //   if (searchWithHistory.isSearching === true) {
  //     setInputPrompt(searchWithHistory.query);
  //     setSearchWithHistory((prev) => ({
  //       ...prev,
  //       isSearching: !prev.isSearching,
  //     }));
  //     setPromptBarState("right");
  //     setResetSearch(false);
  //     setExpendSearch(false);
  //     submitData({ input: searchWithHistory.query, tags: selectedTags, agentic: searchMode==="agentic"? true : false });
  //     console.log(expendSearch);
  //     // console.log("in prompt")
  //     // console.log(searchWithHistory.isSearching)
  //     // console.log(searchWithHistory.query)
  //   }
  // }, [searchWithHistory]);

  useEffect(() => {
    if (searchWithHistory.isSearching === true) {
      setInputPrompt(searchWithHistory.query);
      setSearchWithHistory((prev) => ({
        ...prev,
        isSearching: !prev.isSearching,
      }));
      // setIsSearching(true);
      // setIsExpanded(true);
      setResetSearch(false);
      setExpendSearch(false);
      submitData({ input: searchWithHistory.query, tags: selectedTags });
      console.log(expendSearch);
      // console.log("in prompt")
      // console.log(searchWithHistory.isSearching)
      // console.log(searchWithHistory.query)
    }
  }, [searchWithHistory]);

  const handleSubmit = () => {
    if (isSearchDisabled) return;
    setPromptBarState("right");
    setResetSearch(false);
    submitData({ input: inputPrompt, tags: selectedTags });
  };

  const addTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setAvailableTags((prev) => prev.filter((t) => t !== tag));
  };
  useEffect(() => {
    console.log(PromptBarState);
  }, [PromptBarState]);

  useEffect(() => {
    const { pathname } = location;
    if (
      pathname === routes.place ||
      (pathname === routes.search && expendSearch) ||
      pathname === routes.searchHistory ||
      pathname == routes.bookmarks
    ) {
      setPromptBarState("right");
    } else {
      setPromptBarState("center");
    }
  }, [location.pathname, expendSearch]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputPrompt.trim()) {
        const suggestions = await fetchSuggestedTags(inputPrompt);
        setAvailableTags((prev) => [...new Set([...prev, ...suggestions])]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputPrompt, fetchSuggestedTags]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        PromptBarState != "right" &&
        promptBarRef.current &&
        !promptBarRef.current.contains(e.target)
      ) {
        setPromptBarState("center");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [PromptBarState]);

  const toggleAgenticMode = () => {
    if (searchMode === "normal") {
      if (userLogin) {
        if (hasSemanticSearchAccess(email)) {
          setSearchMode("llm");
        } else {
          toast.error("شما به این گزینه دسترسی ندارید");
        }
      } else {
        toast.error("ابتدا وارد شوید");
      }
    } else {
      setSearchMode("normal");
      // setSearchMode((prev) => (prev === "normal" ? "llm" : "normal"))
    }
  };
  return (
    <>
      {/* Prompt Bar */}
      <div
        onClick={() => {
          if (PromptBarState === "center") setPromptBarState("center-wide");
        }}
        ref={promptBarRef}
        className={`fixed font-sans transition-all duration-500 ease-out bg-white w-[60%]  rounded-3xl
          ${
            PromptBarState == "right" && !isMobile
              ? `
            sm:w-[400px] w-full sm:right-[calc(var(--sidebar-width)+6px)] right-0  sm:bottom-2 bottom-[var(--sidebar-width)] h-[150px] sm:h-[150px]"
            z-[12] 
            shadow-[0_-4px_12px_rgba(0,0,0,0.2)] 
          `
              : `
            ${PromptBarState == "center-wide" || isMobile ? "h-[150px]" : "h-[100px]"}
            ${
              isMobile
                ? "bottom-[calc(var(--sidebar-width)-65px)]"
                : PromptBarState == "center-wide"
                  ? "top-[calc(100vh-110px)]"
                  : "top-[calc(100vh-80px)]"
            } 
            ${isMobile ? "right-2 left-2 w-auto" : "left-[50%]"} 
            ${isMobile ? "" : "-translate-x-[55%]"} 
            shadow-lg
            -translate-y-1/2 
            max-w-[700px]
            z-[10]
            `
          }
            `}
      >
        {/* Submit Button */}
        {PromptBarState != "center" && (
          <button
            onClick={handleSubmit}
            disabled={isSearchDisabled}
            className={`absolute ${promptBarRef == "right" ? "bottom-[30px]" : "bottom-[12px]"} right-3 w-[40px] h-[40px] rounded-full bg-transparent p-0 border-none focus:outline-none hover:scale-110 z-[12]`}
            aria-label="Submit search"
          >
            <img src="/search.svg" alt="Search" className="w-full h-full" />
          </button>
        )}

        {/* Agentic Switch */}
        {PromptBarState != "center" && (
          <div className="absolute bottom-[12px] left-3 z-[12]">
            {/* Icon container */}
            <div className="absolute bottom-full mb-1 left-0 w-full flex justify-start pointer-events-none">
              <AnimatePresence mode="wait">
                {searchMode === "llm" ? (
                  <motion.span
                    key="robot"
                    className="text-base"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    🤖
                  </motion.span>
                ) : (
                  <motion.span
                    key="search"
                    className="text-base"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    🔍
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle Switch */}
            <label className="relative bottom-3 inline-block w-8 h-4 cursor-pointer">
              <input
                type="checkbox"
                checked={searchMode === "llm"}
                onChange={() => toggleAgenticMode()}
                className="sr-only"
              />
              <div
                className={`block w-full h-full rounded-full ${
                  searchMode === "llm" ? "bg-[#A78BFA]" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0 left-0 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  searchMode === "llm" ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </label>
          </div>
        )}

        {/* Text Area and Tag Renderer */}
        <textarea
          ref={textareaRef}
          rows={PromptBarState == "center-wide" ? 3 : 1}
          dir="rtl"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={
            PromptBarState == "center-wide" ? "" : "کجا میخواهید بروید؟"
          }
          className="w-full pr-6 pl-5 z-[10] text-black text-[16px] leading-6 p-2 resize-none outline-none border-none bg-transparent scrollbar-hide"
          style={{
            height: setPromptBarState == "right" ? "100px" : "85px",
            marginTop: "0.5rem",
          }}
        />

        {/* Tag Container */}
        {PromptBarState != "center" && (
          <div
            className={`fixed transition-all duration-300 z-[20] bg-transprent overflow-auto
                    ${PromptBarState == "right" ? (isMobile ? "right-[80px]" : "right-[125px]") : "right-0"}
                    ${PromptBarState == "right" ? "bottom-[12px]" : "bottom-full"}
                    ${PromptBarState == "right" ? "w-[350px]" : "w-full"}
                    opacity-100 translate-y-0
                  `}
            style={{
              top: "auto",
            }}
          >
            <TagContainer
              availableTags={availableTags}
              onTagClick={addTag}
              width={
                isMobile
                  ? 0.5 * window.screen.width
                  : PromptBarState == "right"
                    ? isMobile
                      ? window.screen.width
                      : 340
                    : 0.5 * window.screen.width
              }
            />
          </div>
        )}

        <div
          className={`z-[10] pl-5 pr-1  ${PromptBarState == "right" ? "-mt-6" : ""}`}
        >
          <TagRenderer
            fetchInitialTags={fetchInitialTags}
            setAvailableTags={setAvailableTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
      </div>
    </>
  );
}
