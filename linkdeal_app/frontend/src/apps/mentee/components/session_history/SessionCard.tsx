import { FunctionComponent } from 'react';

interface SessionCardProps {
  session: {
    id: number;
    mentorName: string;
    mentorInitials: string;
    topic: string;
    date: string;
    time: string;
    duration: string;
    price: string;
    rating: number;
    status: string;
    feedback: string;
  };
  onClick?: () => void;
}

const SessionCard: FunctionComponent<SessionCardProps> = ({ session, onClick }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className="h-4 w-4" 
          viewBox="0 0 16 16" 
          fill={i < rating ? "#FFD700" : "none"} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M8 1L10.163 5.38L15 6.12L11.5 9.56L12.326 14.38L8 12.12L3.674 14.38L4.5 9.56L1 6.12L5.837 5.38L8 1Z" 
            stroke="#FFD700" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div 
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-full flex flex-col p-5 sm:p-6 gap-4 cursor-pointer hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
      onClick={onClick}
    >
      <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#7008E7] flex items-center justify-center shrink-0">
            <div className="text-base sm:text-lg text-white font-inter font-semibold">
              {session.mentorInitials}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="text-base sm:text-lg text-white font-inter font-semibold truncate">
              {session.mentorName}
            </div>
            
            <div className="text-sm text-[#A684FF]">
              {session.topic}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-1">
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="12" height="11" rx="1" stroke="#A684FF" strokeWidth="1.5"/>
                  <path d="M11 2V4" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M5 2V4" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 6H14" stroke="#A684FF" strokeWidth="1.5"/>
                </svg>
                <span className="whitespace-nowrap">{session.date}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="#A684FF" strokeWidth="1.5"/>
                  <path d="M8 5v3l2 1" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="whitespace-nowrap">{session.time}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="#A684FF" strokeWidth="1.5"/>
                  <path d="M8 5v3l2 1" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="whitespace-nowrap">{session.duration}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_467_1209)">
                <path d="M8 1.33301V14.6663" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3333 3.33301H6.33333C5.71449 3.33301 5.121 3.57884 4.68342 4.01643C4.24583 4.45401 4 5.0475 4 5.66634C4 6.28518 4.24583 6.87867 4.68342 7.31626C5.121 7.75384 5.71449 7.99967 6.33333 7.99967H9.66667C10.2855 7.99967 10.879 8.24551 11.3166 8.68309C11.7542 9.12068 12 9.71417 12 10.333C12 10.9518 11.7542 11.5453 11.3166 11.9829C10.879 12.4205 10.2855 12.6663 9.66667 12.6663H4" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_467_1209">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <div className="text-lg sm:text-xl text-white font-inter font-semibold">
              {session.price}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {renderStars(session.rating)}
            </div>
            
            <div className="text-xs text-gray-500">
              {session.status}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-[#A684FF] font-inter font-medium">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8.5V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V4C2 3.44772 2.44772 3 3 3H8.5" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 2L14 2L14 6" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2L8 8" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Feedback</span>
        </div>
        
        <div className="text-sm leading-relaxed text-gray-400 font-arimo">
          {session.feedback}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;

