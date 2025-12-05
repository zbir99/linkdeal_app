import { FunctionComponent } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: FunctionComponent<StarRatingProps> = ({ rating, onRatingChange }) => {
  const handleStarClick = (starRating: number) => {
    onRatingChange(starRating);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-lg text-white font-inter">How was your session?</div>
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        {Array.from({ length: 5 }, (_, index) => {
          const star = index + 1;
          const isActive = star <= rating;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className="w-12 h-12 cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 6L29.09 18.26L42 19.27L32.54 27.14L35.18 40L24 33.27L12.82 40L15.46 27.14L6 19.27L18.91 18.26L24 6Z"
                  fill={isActive ? '#FCD34D' : 'none'}
                  stroke={isActive ? '#F59E0B' : '#5B607D'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>
      <div className="text-center text-sm text-gray-400">
        {rating > 0 ? `You rated ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
      </div>
    </div>
  );
};

export { StarRating };
