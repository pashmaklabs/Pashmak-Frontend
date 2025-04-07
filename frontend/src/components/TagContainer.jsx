import React, { useState, useRef, useEffect } from "react";

export default function TagContainer({ availableTags, addTag }) {
  return (
    <div className="relative flex flex-col gap-2 ml-auto">
      <TagList tags={availableTags} addTag={addTag} />
    </div>
  );
}

function TagList({ tags, addTag }) {
  const [isAtFarRight, setIsAtFarRight] = useState(false);
  const [hideIcons, setHideIcons] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const slider = document.getElementById("slider");
    if (slider) {
      setTimeout(() => {
        slider.scrollLeft = slider.scrollWidth - slider.clientWidth;
      }, 0);
      const handleScroll = () => checkIfAtFarRight(slider);
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [tags]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      checkWrapperWidth(wrapper);
    }
  }, [tags]);

  const checkWrapperWidth = (wrapper) => {
    if (wrapper.offsetWidth < 400) {
      setHideIcons(true);
    } else {
      setHideIcons(false);
    }
  };

  const checkIfAtFarRight = (slider) => {
    const isAtRight =
      slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1;
    setIsAtFarRight(isAtRight);
  };

  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft -= 50;
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft += 50;
  };
  console.log("hideIcons: ", hideIcons);
  return (
    <div className="flex items-center relative max-w-[400px]" ref={wrapperRef}>
      {!hideIcons && (
        <img
          src="/more.svg"
          alt="slide left"
          className="w-6 h-6 cursor-pointer transform transition-transform duration-300 ease-in-out"
          onClick={slideLeft}
        />
      )}
      <div
        id="slider"
        className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth flex items-center scrollbar-hide"
      >
        {tags.map((tag) => (
          <Tag key={tag} tag={tag} addTag={addTag} />
        ))}
      </div>
      {!hideIcons && (
        <img
          src="/more.svg"
          alt="slide right"
          className={`w-6 h-6 cursor-pointer transform scale-x-[-1] transition-transform duration-300 ease-in-out ${isAtFarRight ? "hidden" : ""}`}
          onClick={slideRight}
        />
      )}
    </div>
  );
}

function Tag({ tag, addTag }) {
  return (
    <button
      className="flex items-center justify-center bg-white h-4 px-2 text-sm cursor-pointer outline-none focus:outline-none rounded-lg leading-3 shadow-md m-[2px] whitespace-nowrap"
      key={tag}
      onClick={() => addTag(tag)}
    >
      {tag}
    </button>
  );
}
