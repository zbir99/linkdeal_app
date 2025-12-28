import { FunctionComponent, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useBooking } from '../../context/BookingContext';

interface BookingStep1Props {
  onContinue: () => void;
}

const BookingStep1: FunctionComponent<BookingStep1Props> = ({ onContinue }) => {
  const {
    availableSlots,
    selectedDate,
    selectedTime,
    sessionTopic,
    setSelectedDate,
    setSelectedTime,
    setSessionTopic
  } = useBooking();

  // Infinite scroll date picker - start with 30 days
  const [daysToShow, setDaysToShow] = useState(30);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get set of available day_of_week values from mentor availability
  const availableDaysSet = useMemo(() => {
    return new Set(availableSlots.map(slot => slot.day_of_week));
  }, [availableSlots]);

  // Check if a date has availability
  const isDateAvailable = useCallback((date: Date): boolean => {
    if (availableSlots.length === 0) return false;
    const dayOfWeek = date.getDay();
    // Convert JS day (0=Sunday) to backend day (0=Monday)
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return availableDaysSet.has(adjustedDay);
  }, [availableSlots, availableDaysSet]);

  // Generate dates dynamically based on daysToShow
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= daysToShow; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [daysToShow]);

  // Handle scroll to load more dates
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // When user scrolls near the end (within 200px), load more dates
    const { scrollLeft, scrollWidth, clientWidth } = container;
    if (scrollWidth - scrollLeft - clientWidth < 200) {
      setDaysToShow(prev => prev + 30); // Add 30 more days
    }
  }, []);

  // Memoize time slots to prevent infinite loop - only show available slots, no fallback
  const timeSlots = useMemo(() => {
    if (!selectedDate || availableSlots.length === 0) {
      return [];
    }

    const dayOfWeek = selectedDate.getDay();
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const slotsForDay = availableSlots.filter(slot => slot.day_of_week === adjustedDay);

    if (slotsForDay.length === 0) {
      return [];
    }

    const slots: string[] = [];
    slotsForDay.forEach(slot => {
      const startHour = parseInt(slot.start_time.split(':')[0]);
      const endHour = parseInt(slot.end_time.split(':')[0]);
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    });

    return slots;
  }, [selectedDate, availableSlots]);

  // Set default date to first available date
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0 && availableSlots.length > 0) {
      // Find first date that has availability
      const firstAvailableDate = availableDates.find(date => isDateAvailable(date));
      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSlots.length]);

  // Set default time when date changes or time is invalid
  useEffect(() => {
    if (timeSlots.length > 0 && (!selectedTime || !timeSlots.includes(selectedTime))) {
      setSelectedTime(timeSlots[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, timeSlots.length]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canContinue = selectedDate && selectedTime;

  return (
    <div className="w-full flex flex-col items-start gap-6 mr-8">
      {/* Title */}
      <div className="w-full h-9">
        <h2 className="text-[28px] font-inter text-white leading-9">Select Date & Time</h2>
      </div>

      {/* Form Fields */}
      <div className="w-full flex flex-col items-start gap-6">
        {/* Date Selection */}
        <div className="w-full flex flex-col items-start gap-3">
          <div className="flex items-center justify-between w-full">
            <label className="text-[14px] font-arimo text-gray-400 leading-[21px] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A684FF]">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              Preferred Date
            </label>
            {selectedDate && (
              <span className="text-[13px] font-medium text-[#A684FF] bg-[#7008E7]/10 px-3 py-1 rounded-full">
                {formatDate(selectedDate)}
              </span>
            )}
          </div>

          {/* Scrollable Date Cards with Infinite Scroll */}
          <div className="w-full relative">
            {/* Gradient fade on edges */}
            <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="w-full overflow-x-auto pb-2 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-3 min-w-max py-1">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                  const isAvailable = isDateAvailable(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => isAvailable && setSelectedDate(date)}
                      disabled={!isAvailable}
                      className={`group relative min-w-[72px] h-[88px] rounded-xl border-2 backdrop-blur-md flex flex-col items-center justify-center gap-0.5 transition-all duration-300 overflow-hidden ${!isAvailable
                          ? 'bg-white/[0.02] border-white/5 cursor-not-allowed opacity-40'
                          : isSelected
                            ? 'bg-gradient-to-br from-[#7008E7] to-[#9B4DFF] border-transparent shadow-lg shadow-[#7008E7]/40 scale-105'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#7008E7]/30 hover:scale-102'
                        }`}
                    >
                      {/* Glow effect for selected */}
                      {isSelected && isAvailable && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      )}

                      <span className={`text-[11px] font-arimo uppercase tracking-wider ${!isAvailable ? 'text-gray-600' : isSelected ? 'text-white/80' : 'text-gray-500'
                        }`}>
                        {dayName}
                      </span>
                      <span className={`text-[24px] font-inter font-semibold ${!isAvailable ? 'text-gray-600' : isSelected ? 'text-white' : 'text-white'
                        }`}>
                        {date.getDate()}
                      </span>
                      <span className={`text-[11px] font-arimo ${!isAvailable ? 'text-gray-600' : isSelected ? 'text-white/70' : 'text-gray-500'
                        }`}>
                        {monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll to see more dates
          </p>
        </div>

        {/* Time Selection */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A684FF]">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Preferred Time
          </label>
          {timeSlots.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`h-[56px] rounded-lg border-[0.8px] backdrop-blur-md flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 ${selectedTime === time
                      ? 'bg-[#7008E7]/30 border-[#7008E7]/50'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_161_9402)">
                        <path d="M8 4V8L10.6667 9.33333" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_161_9402">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="text-[14px] font-arimo leading-[21px] text-white">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full rounded-lg bg-white/5 border border-white/20 p-4 text-center text-gray-400">
              No available time slots for this date
            </div>
          )}
        </div>

        {/* Session Topic */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Session Topic (Optional)</label>
          <div className="w-full h-12 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-3 py-1 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full bg-transparent outline-none text-[14px] font-arimo placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className={`w-full h-12 rounded-lg text-[14px] font-arimo text-white transition-all duration-300 ${canContinue
          ? 'bg-[#7008E7] hover:bg-[#5a07b8] shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50'
          : 'bg-gray-600 cursor-not-allowed'
          }`}
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default BookingStep1;
