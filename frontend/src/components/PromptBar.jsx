import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import TagContainer from "./TagContainer";
import TagRenderer from "./TagRenderer";
import useIsMobile from "../hooks/useIsMobile";

export default function PromptBar({
  resetSearch,
  setResetSearch,
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
  const [isExpanded, setIsExpanded] = useState(false);

  const promptBarRef = useRef(null);
  const location = useLocation();

  const isSearchDisabled =
    inputPrompt.trim() === "" && selectedTags.length === 0;

  const handleExpand = () => {
    if (!isSearching) setIsExpanded(true);
  };

  const handleSubmit = () => {
    if (isSearchDisabled) return;
    setIsSearching(true);
    setIsExpanded(true);
    setResetSearch(false);
    submitData({ input: inputPrompt, tags: selectedTags });
  };

  const addTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    setAvailableTags((prev) => prev.filter((t) => t !== tag));
  };

  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/map") {
      setIsSearching(false);
      setIsExpanded(false);
    } else if (pathname === "/map/search") {
      setIsSearching(true);
      setIsExpanded(true);
    } else if (pathname === "/map/place") {
      setIsExpanded(isSearching);
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
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearching]);

  
  useEffect(() => {
    if (resetSearch) {
      setInputPrompt("")
      setIsExpanded(false)
      setIsSearching(false)
    }
  }, )

  return (
    <>
      {/* Prompt Bar */}
      <motion.div
        ref={promptBarRef}
        className="fixed font-sans"
        initial={{
          left: "100%",
          right: "auto",
        }}
        animate={
          isSearching
            ? {
                bottom: isMobile ? "var(--sidebar-width)" : "10px",
                top: "auto",
                right: "var(--prompt_right)",
                width: expendSearch ? "400px" : "1rem",
                height: "200px",
                scale: 1,
                opacity: 1,
                zIndex: 12,
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.2)",
              }
            : {
                top: isMobile ? "75%" : "80%",
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
              isSearching || isExpanded
                ? "none"
                : "0px 4px 10px rgba(0,0,0,0.1)",
            backgroundColor:
              isSearching && !expendSearch ? "#F3F3F4" : "#ffffff",
            height: isSearching ? 200 : isExpanded ? 140 : 116,
            borderRadius: isSearching ? "10px" : 20,
            width:
              isSearching && expendSearch
                ? isMobile
                  ? "100%"
                  : 400
                : isSearching
                  ? 18
                  : "100%",
            right: isMobile ? 0 : isSearching ? "var(--prompt_right)" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Submit Button */}
          {isExpanded && (
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
              height: isSearching ? 170 : isExpanded ? 120 : 70,
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
              rows={isExpanded ? 3 : 1}
              dir="rtl"
              value={isSearching && !expendSearch ? "" : inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isExpanded ? "" : "کجا میخواهید بروید؟"}
              className="w-full pr-6 pl-5 z-[10] text-black text-[16px] leading-6 p-2 resize-none outline-none border-none bg-transparent scrollbar-hide"
              style={{
                height: isSearching ? "100px" : isExpanded ? "130px" : "30px",
                marginTop: "0.5rem",
              }}
            />

            {/* Tag Container */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    width:
                      isSearching && expendSearch
                        ? 350
                        : isSearching
                          ? 18
                          : 600,
                    backgroundColor: isSearching
                      ? expendSearch
                        ? "#ffffff"
                        : "#f4f4f5"
                      : "transparent",
                    right: isSearching
                      ? isMobile
                        ? 0
                        : "var(--prompt_right)"
                      : 0,
                    top: "auto",
                    bottom: isSearching ? "10px" : "100%",
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "fixed",
                    zIndex: 10,
                    right: "var(--prompt_right)",
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
                            : 395
                        : window.screen.width * 0.6
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isExpanded && (
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
    </>
  );
}
