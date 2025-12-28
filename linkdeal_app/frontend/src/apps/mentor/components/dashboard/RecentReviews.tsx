import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';

interface Review {
  id: string;
  mentee_name: string;
  mentee_initials: string;
  mentee_picture: string | null;
  rating: number;
  comment: string;
  time_ago: string;
}

const RecentReviews: FunctionComponent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/mentoring/mentor/reviews/recent/');
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch recent reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-6 md:space-y-12 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="w-32 h-6 bg-white/10 rounded" />
          </div>
          <div className="w-48 h-4 bg-white/10 rounded" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="w-24 h-4 bg-white/10 rounded" />
                </div>
                <div className="w-20 h-4 bg-white/10 rounded" />
              </div>
              <div className="w-full h-12 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-6 md:space-y-8 shadow-[0_10px_40px_rgba(10,10,26,0.25)] flex flex-col h-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.66663L12.575 6.88329L18.3333 7.72496L14.1667 11.7833L15.15 17.5166L10 14.8083L4.85 17.5166L5.83333 11.7833L1.66667 7.72496L7.425 6.88329L10 1.66663Z" stroke="#A684FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-normal text-white">Recent Reviews</h2>
        </div>
        <p className="text-xs md:text-sm text-white/60">See what your mentees are saying</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 flex-1">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
            >
              {/* User Info and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {review.mentee_picture ? (
                    <img
                      src={review.mentee_picture}
                      alt={review.mentee_name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border border-white/10"
                      style={{ backgroundColor: '#7008E7' }}
                    >
                      {review.mentee_initials}
                    </div>
                  )}
                  {/* Name */}
                  <span className="text-sm font-medium text-white">{review.mentee_name}</span>
                </div>

                {/* Time */}
                <span className="text-[10px] sm:text-xs font-normal text-white/40">
                  {review.time_ago}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, starIndex) => (
                  <svg key={starIndex} width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 1.33337L10.06 5.50671L14.6667 6.18004L11.3333 9.42671L12.12 14.0134L8 11.8534L3.88 14.0134L4.66667 9.42671L1.33333 6.18004L5.94 5.50671L8 1.33337Z"
                      fill={starIndex < review.rating ? '#A684FF' : 'none'}
                      stroke={starIndex < review.rating ? '#A684FF' : '#52525B'}
                      strokeWidth="1.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-[13px] font-normal text-[#D1D5DC] leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/20">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-white/60 text-sm font-medium">No reviews yet</p>
            <p className="text-white/30 text-xs max-w-[200px]">
              Reviews from your mentees will appear here after they rate your sessions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentReviews;
