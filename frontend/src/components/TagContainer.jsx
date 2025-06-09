import React, { useState, useRef, useEffect } from "react";

export default function TagContainer({ availableTags, onTagClick, width }) {
  return (
    <div className="relative flex flex-col gap-2 ml-auto w-full px-1">
      <TagList tags={availableTags} onTagClick={onTagClick} width={width} />
    </div>
  );
}

function TagList({ tags, onTagClick, width }) {
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
    if (wrapper.offsetWidth < width) {
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
  return (
    <div
      className="flex items-center relative self-end "
      ref={wrapperRef}
      style={{ maxWidth: `${width}px` }}
    >
      {!hideIcons && (
        <img
          src="/more.svg"
          alt="slide left"
          className="w-6 h-6 cursor-pointer transform transition-transform duration-300 ease-in-out "
          onClick={slideLeft}
        />
      )}
      <div
        id="slider"
        className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth flex items-center scrollbar-hide"
      >
        {tags.map((tag) => (
          <Tag key={tag} tag={tag} onTagClick={onTagClick} />
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

function Tag({ tag, onTagClick }) {
  return (
    <button
      className="flex items-center text-gray-700 justify-center bg-white h-6 px-2 text-sm cursor-pointer outline-none focus:outline-none rounded-xl leading-3  shadow-[rgba(0,0,0,0.1)_1px_1px_1px_1px] m-[3px] whitespace-nowrap"
      key={tag}
      onClick={() => onTagClick(tag)}
    >
      {tag}
    </button>
  );
}
