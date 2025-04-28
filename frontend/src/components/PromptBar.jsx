import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TagContainer from "./TagContainer";

export default function PromptBar({
  fetchInitialTags,
  fetchSuggestedTags,
  submitData,
}) {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [uiState, setUiState] = useState({
    isExpanded: false,
    isFullyCollapsed: false,
  });

  const promptBarRef = useRef(null);
  const location = useLocation();

  const isSearchDisabled =
    inputPrompt.trim() === "" && selectedTags.length === 0;

  // Route-driven UI behavior
  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/map") {
      setUiState({ isExpanded: false, isFullyCollapsed: false });
    } else if (pathname === "/map/search" || pathname === "/map/place") {
      setUiState({ isExpanded: false, isFullyCollapsed: true });
    }
  }, [location.pathname]);

  // Initial tag load
  useEffect(() => {
    fetchInitialTags().then(setAvailableTags);
  }, [fetchInitialTags]);

  // Debounced tag suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputPrompt.trim()) {
        const suggestions = await fetchSuggestedTags(inputPrompt);
        setAvailableTags((prev) => [...new Set([...prev, ...suggestions])]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputPrompt, fetchSuggestedTags]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (promptBarRef.current && !promptBarRef.current.contains(e.target)) {
        setUiState({ isExpanded: false, isFullyCollapsed: true });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExpand = () =>
    setUiState({ isExpanded: true, isFullyCollapsed: false });
  const handleExpandFromIcon = () => {
    if (uiState.isExpanded) {
      setUiState({ isExpanded: false, isFullyCollapsed: true });
    } else {
      setUiState({ isExpanded: true, isFullyCollapsed: false });
    }
  };

  const handleOpenChatBox = () => {
    setUiState({ isExpanded: false, isFullyCollapsed: false });
  };

  const handleSubmit = () => {
    if (isSearchDisabled) return;
    submitData({ input: inputPrompt, tags: selectedTags });
    setInputPrompt("");
    setSelectedTags([]);
    handleExpandFromIcon();
  };

  const addTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setAvailableTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setAvailableTags((prev) => [...prev, tag]);
  };

  const renderSelectedTags = () => (
    <div className="flex flex-wrap ml-11 mr-11 max-w-full">
      {selectedTags.map((tag) => (
        <div
          key={tag}
          className="flex items-center h-6 bg-gray-200 px-2 py-1 rounded-xl text-sm text-gray-900 shadow-sm m-[3px] transition-all duration-300"
        >
          {tag}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="h-[16px] w-[16px] ml-2 p-0 border-none bg-transparent cursor-pointer focus:outline-none"
            aria-label={`Remove ${tag}`}
          >
            <img src="/close.svg" alt="Remove" className="w-full h-full" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {console.log(uiState.isExpanded)}
      {/* Expand Button */}
      <button
        onClick={handleOpenChatBox}
        className={`absolute z-[997] focus:outline-none bottom-24 left-8 rounded-full flex justify-center items-center p-0 border-0 bg-transparent transition-all duration-500 transform hover:scale-110 hover:drop-shadow-lg
          ${uiState.isFullyCollapsed ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
        aria-label="Expand search"
      >
        <img src="/ChatExpand.svg" alt="Expand" className="w-20 h-20" />
      </button>

      {/* Prompt Bar */}
      <div
        ref={promptBarRef}
        className={`absolute w-11/12 max-w-[800px] top-1/2 left-1/2 transform z-[30] p-8 font-sans origin-bottom-left transition-all duration-700 ease-in-out
          ${uiState.isFullyCollapsed ? "translate-x-[-150%] translate-y-[80%] scale-50 opacity-0 pointer-events-none" : "translate-x-[-50%] translate-y-[-50%] scale-100 opacity-100"}
        `}
      >
        {
          //#region renderTagContainer
          uiState.isExpanded && (
            <div className="absolute translate-y-[-100%] right-9">
              <TagContainer availableTags={availableTags} addTag={addTag} width={500} />
            </div>
          )
          //#endregion
        }

        <div
          className={`w-full bg-white rounded-[20px] shadow-lg p-2 overflow-hidden overflow-y-auto transition-all duration-700 ease-in-out relative 
          ${uiState.isExpanded ? "h-[200px]" : "h-[116px]"} 
          scrollbar-hide`}
        >
          {/* Collapse + Submit */}
          <button
            onClick={handleExpandFromIcon}
            className={`absolute bottom-4 focus:outline-none left-4 w-8 h-8 rounded-full transition-all duration-300 transform p-0 border-none bg-transparent
              ${uiState.isExpanded ? "rotate-90" : "rotate-0"}`}
            aria-label={uiState.isExpanded ? "Close search" : "Expand search"}
          >
            <img src="/collapse.svg" alt="Collapse" className="w-full h-full" />
          </button>

          {uiState.isExpanded && (
            <button
              onClick={handleSubmit}
              disabled={isSearchDisabled}
              className={`absolute bottom-[18px] right-4 w-[46px] h-[46px] rounded-full transition-opacity duration-300 p-0 border-none bg-transparent
                ${isSearchDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
              aria-label="Submit search"
            >
              <img src="/search.svg" alt="Search" className="w-full h-full" />
            </button>
          )}

          {/* Text + Tags */}
          <div
            className={`flex flex-col gap-2 w-full pb-[4px]  ${uiState.isExpanded ? "h-[180px]" : "h-[70px]"} `}
            onClick={handleExpand}
          >
            <textarea
              rows={uiState.isExpanded ? 3 : 1}
              dir="rtl"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={uiState.isExpanded ? "" : "کجا میخواهید بروید؟"}
              className={`w-full mt-2 pr-5 pl-4 ${uiState.isExpanded ? "h-[130px]" : "h-[30px]"} border-none outline-none bg-transparent text-black text-[16px] leading-6 p-1.5 resize-none transition-all scrollbar-hide`}
              style={{ transition: "all 0.3s ease-out" }}
            />

            {uiState.isExpanded && renderSelectedTags()}
          </div>
        </div>
      </div>
    </>
  );
}
