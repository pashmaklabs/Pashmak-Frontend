import React, { useState } from "react";
import { Star } from "lucide-react";

const RatingStars = ({ totalStars = 5, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);

  const handleClick = (index) => {
    setRating(index);
    if (onRate) onRate(index);
  };

  return (
    <div className="flex gap-0">
      {Array.from({ length: totalStars }, (_, i) => {
        const index = i + 1;
        const isFilled = hovered ? index <= hovered : index <= rating;

        return (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              handleClick(index);
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="text-yellow-400 hover:scale-110 transition-transform bg-white border-none focus:outline-none p-0 w-[47px]"
            aria-label={`Rate ${index} star${index > 1 ? "s" : ""}`}
          >
            <Star
              size={40}
              fill={isFilled ? "#facc15" : "#D1D5DB"}
              stroke={isFilled ? "#facc15" : "#D1D5DB"}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
