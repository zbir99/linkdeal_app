import { FunctionComponent } from 'react';

interface Review {
  initials: string;
  name: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const RecentReviews: FunctionComponent = () => {
  const reviews: Review[] = [
    {
      initials: 'SM',
      name: 'Sophie Martin',
      rating: 5,
      comment: 'Excellent mentor, very pedagogical!',
      timeAgo: '2 days ago'
    },
    {
      initials: 'JP',
      name: 'Julie Petit',
      rating: 4,
      comment: 'Good session, I learned a lot.',
      timeAgo: '1 week ago'
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-6 md:space-y-12 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.66663L12.575 6.88329L18.3333 7.72496L14.1667 11.7833L15.15 17.5166L10 14.8083L4.85 17.5166L5.83333 11.7833L1.66667 7.72496L7.425 6.88329L10 1.66663Z" stroke="#A684FF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-normal text-white">Recent Reviews</h2>
        </div>
        <p className="text-xs md:text-sm text-white/60">See what your mentees are saying</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div 
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            {/* User Info and Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-normal text-white"
                  style={{ backgroundColor: '#7008E7' }}
                >
                  {review.initials}
                </div>
                {/* Name */}
                <span className="text-sm font-normal text-white">{review.name}</span>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center gap-0">
                {[...Array(5)].map((_, starIndex) => (
                  <div key={starIndex} className="w-4 h-4">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M8 1.33337L10.06 5.50671L14.6667 6.18004L11.3333 9.42671L12.12 14.0134L8 11.8534L3.88 14.0134L4.66667 9.42671L1.33333 6.18004L5.94 5.50671L8 1.33337Z" 
                        fill={starIndex < review.rating ? '#A684FF' : 'none'}
                        stroke="#A684FF" 
                        strokeWidth="1.33" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-[13px] font-normal text-[#D1D5DC] leading-[19.5px]">
              "{review.comment}"
            </p>

            {/* Time */}
            <p className="text-xs font-normal text-[#6A7282]">
              {review.timeAgo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReviews;

