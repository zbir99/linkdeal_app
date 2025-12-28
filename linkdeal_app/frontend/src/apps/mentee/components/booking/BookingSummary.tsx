import { FunctionComponent } from 'react';
import { useBooking } from '../../context/BookingContext';

interface BookingSummaryProps { }

const BookingSummary: FunctionComponent<BookingSummaryProps> = () => {
  const { mentor, selectedDate, selectedTime, duration, totalPrice } = useBooking();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select a date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md w-full lg:w-[320px] h-auto flex flex-col items-start pt-6 pb-4 pl-6 pr-6 gap-4">
      {/* Title */}
      <div className="w-full h-[27px]">
        <h3 className="text-[20px] font-inter text-white leading-[27px]">Booking Summary</h3>
      </div>

      {/* Mentor Info */}
      <div className="w-full border-b border-white/20 pb-4 flex items-center gap-3">
        {mentor ? (
          <>
            {mentor.profile_picture_url ? (
              <img
                src={mentor.profile_picture_url}
                alt={mentor.full_name}
                className="h-12 w-12 rounded-full object-cover hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50">
                <span className="text-white text-lg font-inter leading-6">{getInitials(mentor.full_name)}</span>
              </div>
            )}
            <div className="flex-1 flex flex-col items-start">
              <div className="text-[16px] font-inter text-white leading-[22.5px]">
                {mentor.full_name}
              </div>
              <div className="text-[14px] font-arimo text-gray-400 leading-[19.5px] whitespace-nowrap">
                {mentor.professional_title}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 w-24 bg-white/10 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Date & Time */}
      <div className="w-full flex flex-col items-start gap-3 text-gray-400">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#A684FF" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
          </svg>
          <span className="text-[14px] font-arimo leading-[21px]">{formatDate(selectedDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-arimo leading-[21px]">{selectedTime || 'Select a time'}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="w-full border-t border-white/20 flex flex-col items-start pt-4 gap-2">
        <div className="w-full h-6 flex items-center justify-between">
          <span className="text-[14px] font-arimo text-gray-400 leading-[21px]">Session ({duration} min)</span>
          <span className="text-[16px] font-inter text-white leading-6">${totalPrice}</span>
        </div>
        <div className="w-full h-6 flex items-center justify-between">
          <span className="text-[14px] font-arimo text-gray-400 leading-[21px]">Platform Fee</span>
          <span className="text-[16px] font-inter text-white leading-6">$0</span>
        </div>
        <div className="w-full border-t border-white/20 pt-4 flex items-center justify-between">
          <span className="text-[16px] font-inter text-white leading-6">Total</span>
          <span className="text-[24px] font-inter text-[#A684FF] leading-9">${totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
