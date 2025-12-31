import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

interface BookingStep4Props { }

const BookingStep4: FunctionComponent<BookingStep4Props> = () => {
  const navigate = useNavigate();
  const { mentor, selectedDate, selectedTime, duration, resetBooking } = useBooking();

  const handleGoToDashboard = () => {
    resetBooking();
    navigate('/mentee/dashboard');
  };

  const handleAddToCalendar = () => {
    if (!selectedDate || !selectedTime || !mentor) return;

    // Create Google Calendar event URL
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, -1);
    };

    const event = {
      text: `Session with ${mentor.full_name}`,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: `Mentoring session with ${mentor.full_name} (${mentor.professional_title})`,
      location: 'Online Video Call'
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleBookAnother = () => {
    resetBooking();
    navigate('/mentee/find-mentor');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 md:p-12 flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
      {/* Success Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#00C950" fillOpacity="0.2" />
          <path d="M42.6663 24L27.9997 38.6667L21.333 32" stroke="#00C950" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Success Message */}
      <div className="w-full text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-[36px] font-inter text-white leading-tight sm:leading-[54px] mb-4 sm:mb-6">Booking Confirmed!</h2>
        <p className="text-sm sm:text-base md:text-[18px] font-arimo text-gray-400 leading-relaxed sm:leading-[27px] max-w-[500px] mx-auto">
          Your session with {mentor?.full_name || 'your mentor'} is confirmed for {formatDate(selectedDate)} at {selectedTime}
        </p>
      </div>

      {/* Session Details Card */}
      {mentor && (
        <div className="w-full max-w-[400px] rounded-xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            {mentor.profile_picture_url ? (
              <img
                src={mentor.profile_picture_url}
                alt={mentor.full_name}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'w-14 h-14 rounded-full bg-[#7008E7] flex items-center justify-center';
                    fallbackDiv.innerHTML = `<span class="text-white font-inter text-lg">${mentor.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>`;
                    parent.insertBefore(fallbackDiv, e.currentTarget);
                  }
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#7008E7] flex items-center justify-center">
                <span className="text-white font-inter text-lg">
                  {mentor.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
            )}
            <div>
              <div className="text-white font-inter text-lg">{mentor.full_name}</div>
              <div className="text-gray-400 text-sm">{mentor.professional_title}</div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span className="text-white">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time</span>
              <span className="text-white">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration</span>
              <span className="text-white">{duration} minutes</span>
            </div>
          </div>
        </div>
      )}

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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Add to Calendar</span>
          </button>
          <button
            onClick={handleBookAnother}
            className="w-full sm:flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-medium hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Book Another Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStep4;
