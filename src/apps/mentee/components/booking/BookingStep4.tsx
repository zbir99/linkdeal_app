import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookingStep4Props {}

const BookingStep4: FunctionComponent<BookingStep4Props> = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/mentee/dashboard');
  };

  const handleAddToCalendar = () => {
    // Create Google Calendar event URL
    const event = {
      text: 'Session with Dr. Emily Chen',
      dates: '20251116T140000Z/20251116T150000Z', // Example: Nov 16, 2025, 2:00 PM - 3:00 PM UTC
      details: 'Mentoring session with Dr. Emily Chen',
      location: 'Online Video Call'
    };
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleReschedule = () => {
    // Navigate back to booking step 2 (date/time selection)
    navigate('/mentee/booking');
  };

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 md:p-12 flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
      {/* Success Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#00C950" fill-opacity="0.2"/>
          <path d="M42.6663 24L27.9997 38.6667L21.333 32" stroke="#00C950" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      {/* Success Message */}
      <div className="w-full text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-[36px] font-inter text-white leading-tight sm:leading-[54px] mb-4 sm:mb-6">Booking Confirmed!</h2>
        <p className="text-sm sm:text-base md:text-[18px] font-arimo text-gray-400 leading-relaxed sm:leading-[27px] max-w-[500px] mx-auto">
          Your session with Dr. Emily Chen is confirmed for 16/11/2025
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3 sm:gap-4 max-w-[450px]">
        <button
          onClick={handleGoToDashboard}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-base font-medium font-arimo text-white hover:from-[#5a07b8] hover:to-[#7008E7] transition-all duration-300 shadow-lg shadow-[#7008E7]/40 hover:shadow-xl hover:shadow-[#7008E7]/60 flex items-center justify-center hover:scale-[1.02]"
        >
          Go to Dashboard
        </button>
        
        {/* Additional Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCalendar}
            className="w-full sm:flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-medium hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add to Calendar</span>
          </button>
          <button
            onClick={handleReschedule}
            className="w-full sm:flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-medium hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Reschedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStep4;
