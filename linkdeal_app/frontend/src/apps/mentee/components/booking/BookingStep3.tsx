import { FunctionComponent, useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import api from '@/services/api';

interface BookingStep3Props {
  onContinue: () => void;
  onBack: () => void;
}

const BookingStep3: FunctionComponent<BookingStep3Props> = ({ onContinue, onBack }) => {
  const {
    mentor,
    selectedDate,
    selectedTime,
    sessionTopic,
    duration,
    totalPrice,
    setCreatedSessionId,
    setError
  } = useBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleConfirmBooking = async () => {
    if (!mentor || !selectedDate || !selectedTime) {
      setSubmitError('Missing required booking information');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Combine date and time into ISO format
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const bookingData = {
        mentor_id: mentor.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: duration,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        topic: sessionTopic || 'Mentoring Session',
        mentee_notes: sessionTopic,
        objectives: sessionTopic ? [sessionTopic] : [],
      };

      const response = await api.post('scheduling/sessions/create/', bookingData);

      setCreatedSessionId(response.data.id);
      onContinue();
    } catch (err: unknown) {
      console.error('Error creating booking:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      setSubmitError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-6 mr-8">
      {/* Title */}
      <div className="w-full flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 flex items-center justify-center mb-5">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#00C950" fillOpacity="0.2" />
            <path d="M42.6663 24L27.9997 38.6667L21.333 32" stroke="#05DF72" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Main Title */}
        <h2 className="text-[24px] font-inter text-white leading-9 mb-2">Confirm Your Booking</h2>

        {/* Subtitle */}
        <p className="text-[15px] font-arimo text-gray-400 leading-[22.5px]">Please review your booking details</p>
      </div>

      {/* Booking Details */}
      <div className="w-full flex flex-col items-start gap-4">
        {/* Mentor Card */}
        {mentor && (
          <div className="w-full rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex items-center p-4 gap-3">
            {mentor.profile_picture_url ? (
              <img
                src={mentor.profile_picture_url}
                alt={mentor.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#7008E7] flex items-center justify-center">
                <span className="text-white font-inter">
                  {mentor.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="text-[16px] font-inter text-white">{mentor.full_name}</div>
              <div className="text-[14px] font-arimo text-gray-400">{mentor.professional_title}</div>
            </div>
          </div>
        )}

        {/* Date Card */}
        <div className="w-full rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start p-4 gap-1">
          <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Date</div>
          <div className="text-[16px] font-inter text-white leading-6">{formatDate(selectedDate)}</div>
        </div>

        {/* Time Card */}
        <div className="w-full rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start p-4 gap-1">
          <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Time</div>
          <div className="text-[16px] font-inter text-white leading-6">{selectedTime || 'Not selected'}</div>
        </div>

        {/* Topic Card */}
        {sessionTopic && (
          <div className="w-full rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex flex-col items-start p-4 gap-1">
            <div className="text-[12px] font-arimo text-gray-400 leading-[18px]">Topic</div>
            <div className="text-[16px] font-inter text-white leading-6">{sessionTopic}</div>
          </div>
        )}

        {/* Price Card */}
        <div className="w-full rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-between p-4">
          <div className="text-[14px] font-arimo text-gray-400">Total Amount</div>
          <div className="text-[20px] font-inter text-[#A684FF]">${totalPrice}</div>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="w-full rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-center text-[14px]">
          {submitError}
        </div>
      )}

      {/* Buttons */}
      <div className="w-full h-12 flex items-start gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center py-2 px-4 text-[14px] font-arimo text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-lg bg-[#7008E7] text-[14px] font-arimo text-white hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50 flex items-center justify-center py-2 px-4 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Confirm & Pay $${totalPrice}`
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;
