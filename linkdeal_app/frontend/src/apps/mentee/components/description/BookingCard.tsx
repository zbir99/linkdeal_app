import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookingCardProps {
  price: number;
  duration: string;
}

const BookingCard: FunctionComponent<BookingCardProps> = ({ price, duration }) => {
  const navigate = useNavigate();
  const handleBookSession = () => {
    navigate('/mentee/booking');
  };

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md w-full max-w-[360px] lg:max-w-[304px] min-h-[279.6px] flex flex-col items-start py-6 pl-6 pr-4 sm:pr-6">
      <div className="w-full flex-1 flex flex-col items-start gap-4">
        {/* Price Section */}
        <div className="w-full min-h-20 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex items-center py-0 pl-4 pr-0 gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[14px] text-gray-400 leading-[18px]">Price per Session</div>
            <div className="text-[20px] text-white font-inter leading-[30px]">${price}</div>
          </div>
        </div>

        {/* Duration Section */}
        <div className="w-full min-h-[74px] rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex items-center py-0 pl-4 pr-0 gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[14px] text-gray-400 leading-[18px]">Session Duration</div>
            <div className="text-[16px] text-white font-inter leading-6">{duration}</div>
          </div>
        </div>

        {/* Book Session Button */}
        <button
          onClick={handleBookSession}
          className="w-full h-11 rounded-lg bg-[#7008E7] text-[14px] text-white font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50 flex items-center justify-center"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
