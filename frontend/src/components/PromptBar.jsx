import React, { useState, useRef, useEffect } from "react";
import TagContainer from "./TagContainer";

export default function PromptBar({
  fetchInitialTags,
  fetchSuggestedTags,
  submitData,
}) {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullyCollapsed, setIsFullyCollapsed] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const promptBarRef = useRef(null);

  const isSearchDisabled =
    inputPrompt.trim() === "" && selectedTags.length === 0;

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await fetchInitialTags();
      setAvailableTags(tags);
    };
    fetchTags();
  }, [fetchInitialTags]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputPrompt.trim() !== "") {
        const suggestions = await fetchSuggestedTags(inputPrompt);
        for (const suggestion of suggestions) {
          if (!availableTags.includes(suggestion)) {
            setAvailableTags((prev) => [...prev, suggestion]);
          }
        }
      }
    };
    fetchSuggestions();
  }, [inputPrompt, fetchSuggestedTags]);

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsFullyCollapsed(true);
      setIsExpanded(false);
    }
  };
  const handleExpandFromIcon = () => {
    setIsFullyCollapsed(false);
  };

  const addTagToText = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setAvailableTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setAvailableTags((prev) => [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!isSearchDisabled) {
      await submitData({ input: inputPrompt, tags: selectedTags });
      setInputPrompt("");
      setSelectedTags([]);
    }
  };

  return (
    <>
      {isFullyCollapsed ? (
        <div
          className="shadow-xl absolute z-[1000] bottom-24 left-6 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 "
          onClick={handleExpandFromIcon}
        >
          <img src="/ChatExpand.svg" alt="expand" className="w-20 h-20" />
        </div>
      ) : (
        <div className="z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] max-w-[800px] p-8 font-sans transition-all duration-300 ease-in-out">
          {isExpanded && (
            <div className="relative right-[8px] flex flex-nowrap">
              <TagContainer
                availableTags={availableTags}
                addTag={addTagToText}
              />
            </div>
          )}
          <div
            className={`w-[737px] h-[116px] bg-white flex flex-col justify-start items-end rounded-[20px] shadow-lg transition-all duration-300 ease-in-out overflow-hidden p-2 overflow-y-auto relative ${isExpanded ? "h-[190px]" : ""}`}
          >
            <img
              src="/collapse.svg"
              alt="collapse"
              onClick={handleCollapse}
              className={`absolute bottom-4 left-4 cursor-pointer w-8 h-8 transform transition-transform duration-300 ease-in-out rotate-90 ${isExpanded ? "rotate-180" : ""}`}
            />
            {isExpanded && (
              <img
                src="/search.svg"
                alt="search"
                className={`absolute bottom-4 right-4 cursor-pointer w-12 h-12 transition-opacity duration-300 ease-in-out ${isSearchDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSubmit}
                style={{ pointerEvents: isSearchDisabled ? "none" : "auto" }}
              />
            )}
            <div
              className="flex flex-col gap-2 w-full pb-2 "
              onClick={handleExpand}
            >
              <textarea
                rows={isExpanded ? 3 : 1}
                type="text"
                placeholder={isExpanded ? "" : "کجا میخواهید بروید؟"}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="w-90% h-auto text-black mt-2 mr-4 min-h-[40px] border-none outline-none text-[16px] text-right bg-transparent p-1.5 resize-none leading-6"
                dir="rtl"
              />
              {isExpanded && (
                <div className="flex flex-wrap ml-2 max-w-full">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex text-gray-900 items-center h-6 bg-gray-200 px-2 py-1 rounded-xl text-sm shadow-sm m-[3px]"
                    >
                      {tag}
                      <img
                        src="/close.svg"
                        alt="remove"
                        className="h-[16px] w-[16px] ml-2 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
