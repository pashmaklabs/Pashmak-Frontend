import React from "react";

const StarRating = ({ rating, reviews }) => {
  // Render stars for the rating
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const isFullStar = index < Math.floor(rating);
      const isHalfStar = index === Math.floor(rating) && rating % 1 !== 0;

      return (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-3 h-3"
        >
          {isFullStar ? (
            <path
              fill="gold"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          ) : isHalfStar ? (
            <>
              <defs>
                <linearGradient id={`half-star-${index}`}>
                  <stop offset="50%" stopColor="gray" />
                  <stop offset="50%" stopColor="gold" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-star-${index})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </>
          ) : (
            <path
              fill="gray"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          )}
        </svg>
      );
    });
  };

  return (
    <>
      <div className="flex items-center mr-1">
        {renderStars()}
        <p className="text-xs text-gray-600 mr-1 mt-1">
          {rating} ({reviews})
        </p>
      </div>
    </>
  );
};

export default StarRating;
