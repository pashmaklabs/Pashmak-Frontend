import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animations/search-animation.json";

const searchStages = [
  { text: "برقراری ارتباط با سرور" },
  { text: "تحلیل درخواست شما" },
  { text: "نشانه‌گذاری نقاط مرتبط" },
  { text: "دسته‌بندی و آماده‌سازی نتایج" },
];

const DURATION_PER_STAGE = 1300;

const SearchLoader = ({ isVisible }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setCurrentStageIndex(0);
      const interval = setInterval(() => {
        setCurrentStageIndex((prevIndex) => {
          if (prevIndex < searchStages.length - 1) {
            return prevIndex + 1;
          }
          clearInterval(interval);
          return prevIndex;
        });
      }, DURATION_PER_STAGE);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const totalAnimationDuration =
    (searchStages.length * DURATION_PER_STAGE) / 1000;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${
        isVisible ? "translate-y-0" : "-translate-y-40"
      } w-[90%] max-w-[400px] z-[10] bg-[rgba(40,40,60,0.6)] backdrop-blur border border-white/10 shadow-lg rounded-2xl px-5 py-3 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 shrink-0">
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="flex-grow text-right">
          <p
            key={currentStageIndex}
            className="text-sm font-medium text-gray-100 animate-fadeIn"
          >
            {searchStages[currentStageIndex].text}
          </p>
        </div>
      </div>
      {isVisible && (
        <div className="relative w-full h-1 mt-3 bg-black/20 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400 to-purple-800 animate-indeterminate"
            style={{
              animationDuration: `${totalAnimationDuration}s`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default SearchLoader;
