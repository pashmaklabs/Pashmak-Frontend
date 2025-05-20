import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import TagContainer from "./TagContainer";
import TagRenderer from "./TagRenderer";
import useIsMobile from "../hooks/useIsMobile";

export default function PromptBar({
  fetchInitialTags,
  fetchSuggestedTags,
  submitData,
  expendSearch,
}) {
  const isMobile = useIsMobile();
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [uiState, setUiState] = useState({
    isExpanded: false,
    isFullyCollapsed: false,
  });

  const promptBarRef = useRef(null);
  const location = useLocation();

  const isSearchDisabled =
    inputPrompt.trim() === "" && selectedTags.length === 0;

  const handleExpand = () => {
    if (!isSearching) setUiState({ isExpanded: true, isFullyCollapsed: false });
  };

  const handleExpandFromIcon = () => {
    setUiState((prev) => ({
      isExpanded: !prev.isExpanded,
      isFullyCollapsed: prev.isExpanded,
    }));
  };

  const handleOpenChatBox = () => {
    setUiState({ isExpanded: false, isFullyCollapsed: false });
  };

  const handleSubmit = () => {
    if (isSearchDisabled) return;
    setIsSearching(true);
    setUiState({ isExpanded: true, isFullyCollapsed: false });
    submitData({ input: inputPrompt, tags: selectedTags });
  };

  const addTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setAvailableTags((prev) => prev.filter((t) => t !== tag));
  };

  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/map") {
      setUiState({ isExpanded: false, isFullyCollapsed: false });
    } else if (pathname === "/map/search") {
      setIsSearching(true);
      setUiState({ isExpanded: true, isFullyCollapsed: false });
    } else if (pathname === "/map/place") {
      setUiState({
        isExpanded: isSearching,
        isFullyCollapsed: !isSearching,
      });
    }
  }, [location.pathname, isSearching]);

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
        !isSearching &&
        promptBarRef.current &&
        !promptBarRef.current.contains(e.target)
      ) {
        setUiState({ isExpanded: false, isFullyCollapsed: true });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearching]);

  return (
    <>
      {/* Expand Button */}
      {!isSearching && (
        <motion.button
          onClick={handleOpenChatBox}
          className="absolute sm:bottom-24 bottom-36 sm:left-8 left-2 z-[11] rounded-full p-0 border-0 bg-transparent focus:outline-none flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: uiState.isFullyCollapsed ? 1 : 0,
            scale: uiState.isFullyCollapsed ? 1 : 0.75,
          }}
          transition={{ duration: 0.5 }}
          aria-label="Expand search"
        >
          <img src="/ChatExpand.svg" alt="Expand" className="w-20 h-20" />
        </motion.button>
      )}

      {/* Prompt Bar */}
      <motion.div
        ref={promptBarRef}
        className="fixed font-sans"
        initial={{
          top: "10%",
          left: "100%",
          right: "auto",
        }}
        animate={
          isSearching
            ? {
                top: 0,
                right: "auto",
                width: expendSearch ? "400px" : "1rem",
                height: "200px",
                scale: 1,
                opacity: 1,
                borderRadius: 0,
                zIndex: 12,
              }
            : uiState.isFullyCollapsed
              ? {
                  top: "81%",
                  left: "5%",
                  x: "-180%",
                  y: "150%",
                  width: 0,
                  height: 0,
                  maxWidth: "800px",
                  scale: 0.5,
                  opacity: "20%",
                  pointerEvents: "none",
                  zIndex: 10,
                }
              : {
                  top: "40%",
                  left: "50%",
                  x: isMobile ? "-50%" : "-55%",
                  y: "-50%",
                  width: "80%",
                  maxWidth: "800px",
                  scale: 1,
                  opacity: 1,
                  zIndex: 10,
                }
        }
        transition={{ type: "spring", stiffness: 300, damping: 50 }}
      >
        {/* Textarea + Actions */}
        <motion.div
          className="fixed scrollbar-hide overflow-hidden overflow-y-auto"
          animate={{
            boxShadow:
              isSearching || uiState.isExpanded
                ? "none"
                : "0px 4px 10px rgba(0,0,0,0.1)",
            backgroundColor:
              isSearching && !expendSearch ? "#F3F3F4" : "#ffffff",
            height: isSearching ? 200 : uiState.isExpanded ? 200 : 116,
            borderRadius: isSearching ? 0 : 20,
            width:
              isSearching && expendSearch
                ? isMobile
                  ? "100%"
                  : 400
                : isSearching
                  ? 18
                  : "100%",
            right: isMobile ? 0 : isSearching ? 70 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Expand/Collapse Button */}
          {!isSearching && (
            <motion.button
              onClick={handleExpandFromIcon}
              className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-transparent p-0 border-none focus:outline-none z-[12]"
              animate={{ rotate: uiState.isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              aria-label={uiState.isExpanded ? "Close search" : "Expand search"}
            >
              <img
                src="/collapse.svg"
                alt="Collapse"
                className="w-full h-full"
              />
            </motion.button>
          )}

          {/* Submit Button */}
          {uiState.isExpanded && (
            <motion.button
              onClick={handleSubmit}
              disabled={isSearchDisabled}
              className={`absolute ${isSearching ? "bottom-[30px]" : "bottom-[19px]"} right-5 w-[28px] h-[28px] rounded-full bg-transparent p-0 border-none focus:outline-none hover:scale-110 z-[12]`}
              whileHover={!isSearchDisabled ? { scale: 1.1 } : {}}
              aria-label="Submit search"
            >
              <img src="/search.svg" alt="Search" className="w-full h-full" />
            </motion.button>
          )}

          {/* Text Area and Tag Renderer */}
          <motion.div
            onClick={handleExpand}
            initial={false}
            animate={{
              height: isSearching ? 170 : uiState.isExpanded ? 180 : 70,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              marginBottom: 10,
              paddingRight: 0,
              marginRight: 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              rows={uiState.isExpanded ? 3 : 1}
              dir="rtl"
              value={isSearching && !expendSearch ? "" : inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={uiState.isExpanded ? "" : "کجا میخواهید بروید؟"}
              className="w-full pr-6 pl-5 z-[10] text-black text-[16px] leading-6 p-2 resize-none outline-none border-none bg-transparent scrollbar-hide"
              style={{
                height: isSearching
                  ? "100px"
                  : uiState.isExpanded
                    ? "130px"
                    : "30px",
                marginTop: "0.5rem",
              }}
            />

            {/* Tag Container */}
            <AnimatePresence>
              {uiState.isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    width:
                      isSearching && expendSearch
                        ? 402
                        : isSearching
                          ? 18
                          : 600,
                    backgroundColor: isSearching
                      ? expendSearch
                        ? "#ffffff"
                        : "#f4f4f5"
                      : "transparent",
                    right: isSearching ? (isMobile ? 0 : 62) : 0,
                    top: isSearching ? 170 : "auto",
                    bottom: isSearching ? "auto" : "100%",
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "fixed",
                    zIndex: 10,
                    right: 0,
                  }}
                >
                  <TagContainer
                    availableTags={availableTags}
                    onTagClick={addTag}
                    width={
                      isSearching
                        ? !expendSearch
                          ? 0
                          : isMobile
                            ? window.screen.width
                            : 412
                        : isMobile
                          ? 312
                          : window.screen.width * 0.6
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {uiState.isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="z-[10] pl-5 pr-1"
              >
                <TagRenderer
                  fetchInitialTags={fetchInitialTags}
                  setAvailableTags={setAvailableTags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
      {/* </motion.div> */}
    </>
  );
}
