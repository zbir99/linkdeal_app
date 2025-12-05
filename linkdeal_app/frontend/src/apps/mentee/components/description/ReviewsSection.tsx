import { FunctionComponent } from 'react';

interface Review {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: FunctionComponent<ReviewsSectionProps> = ({ reviews }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={index < rating ? "#FBBF24" : "#374151"}
              stroke={index < rating ? "#FBBF24" : "#374151"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[574.4px] h-[299px] flex flex-col items-start gap-3">
      <div className="self-stretch h-[27px] relative">
        <div className="text-white text-[27px] font-inter leading-[27px]">Reviews</div>
      </div>
      <div className="self-stretch h-[260px] flex flex-col items-start gap-3 text-[14px] text-gray-400 font-arimo">
        {reviews.map((review, index) => (
          <div key={index} className="self-stretch h-[124px] rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex flex-col items-start pt-4 px-4 pb-0 gap-2">
            <div className="self-stretch h-4 flex items-center gap-2">
              {renderStars(review.rating)}
            </div>
            <div className="self-stretch h-[42px] relative">
              <div className="leading-[21px] inline-block w-[542px]">"{review.comment}"</div>
            </div>
            <div className="self-stretch h-[18px] relative text-[12px] text-gray-500">
              <div className="leading-[18px]">- {review.author}, {review.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
