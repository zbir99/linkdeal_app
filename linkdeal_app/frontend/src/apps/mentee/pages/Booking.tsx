import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookingProvider, useBooking } from '../context/BookingContext';
import BookingSummary from '../components/booking/BookingSummary';
import BookingStep1 from '../components/booking/BookingStep1';
import BookingStep2 from '../components/booking/BookingStep2';
import BookingStep3 from '../components/booking/BookingStep3';
import BookingStep4 from '../components/booking/BookingStep4';
import api from '@/services/api';

interface SessionType {
  id: string;
  name: string;
  description: string;
  default_duration: number;
}

interface TimeSlot {
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
}

interface MentorData {
  id: string;
  full_name: string;
  professional_title: string;
  profile_picture_url: string | null;
  session_rate: number;
}

const BookingContent: FunctionComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { mentorId } = useParams<{ mentorId: string }>();
  const {
    setMentor,
    setSessionTypes,
    setAvailableSlots,
    setIsLoading,
    setError,
    isLoading,
    error,
  } = useBooking();

  // Fetch mentor data, session types, and availability on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!mentorId) {
        setError('Mentor ID not provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch mentor details
        const mentorResponse = await api.get(`mentoring/mentors/${mentorId}/`);
        const mentorData: MentorData = {
          id: mentorResponse.data.id,
          full_name: mentorResponse.data.full_name,
          professional_title: mentorResponse.data.professional_title || 'Mentor',
          profile_picture_url: mentorResponse.data.profile_picture_url || mentorResponse.data.social_picture_url,
          session_rate: mentorResponse.data.session_rate ?? 0,
        };
        setMentor(mentorData);

        // Fetch session types
        const sessionTypesResponse = await api.get('scheduling/session-types/');
        setSessionTypes(sessionTypesResponse.data as SessionType[]);

        // Fetch mentor availability
        const availabilityResponse = await api.get(`scheduling/mentors/${mentorId}/availability/`);
        setAvailableSlots(availabilityResponse.data as TimeSlot[]);

      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId]);

  const handleBackToProfile = () => {
    navigate(`/mentee/description/${mentorId}`);
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleBookingComplete = () => {
    setCurrentStep(4);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7008E7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading booking information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-white mb-4">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          <button
            onClick={handleBackToProfile}
            className="px-6 py-2 rounded-lg bg-[#7008E7] text-white hover:bg-[#5a07b8] transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-[-34px] left-[-192px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
      <div className="absolute top-[388px] left-[636.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Booking Form */}
            {currentStep < 4 && (
              <div className="flex-1">
                <button
                  onClick={handleBackToProfile}
                  className="mb-6 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md px-4 py-2 text-gray-400 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 whitespace-nowrap"
                >
                  ← Back to Profile
                </button>

                <div className="rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md w-full lg:w-[700px] h-auto min-h-[665.8px] flex flex-col items-start pt-8 pb-8 pl-8 pr-8 gap-14">
                  {/* Progress Steps */}
                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentStep >= 1
                          ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                          : 'bg-white/10 text-gray-400'
                          }`}
                        onClick={() => handleStepChange(1)}
                      >
                        <span className="text-lg font-inter">1</span>
                      </div>
                      <div className={`h-1 flex-1 transition-all duration-300 ${currentStep >= 1 ? 'bg-[#7008E7]' : 'bg-white/20'
                        }`} />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentStep >= 2
                          ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                          : 'bg-white/10 text-gray-400'
                          }`}
                        onClick={() => handleStepChange(2)}
                      >
                        <span className="text-lg font-inter">2</span>
                      </div>
                      <div className={`h-1 flex-1 transition-all duration-300 ${currentStep >= 2 ? 'bg-[#7008E7]' : 'bg-white/20'
                        }`} />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentStep >= 3
                          ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                          : 'bg-white/10 text-gray-400'
                          }`}
                        onClick={() => handleStepChange(3)}
                      >
                        <span className="text-lg font-inter">3</span>
                      </div>
                      <div className={`h-1 flex-1 transition-all duration-300 ${currentStep >= 3 ? 'bg-[#7008E7]' : 'bg-white/20'
                        }`} />
                    </div>
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${currentStep >= 4
                        ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                        : 'bg-white/10 text-gray-400'
                        }`}
                      onClick={() => handleStepChange(4)}
                    >
                      <span className="text-lg font-inter">4</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="w-full flex-1">
                    {currentStep === 1 && <BookingStep1 onContinue={handleContinue} />}
                    {currentStep === 2 && <BookingStep2 onContinue={handleContinue} onBack={handleBack} />}
                    {currentStep === 3 && <BookingStep3 onContinue={handleBookingComplete} onBack={handleBack} />}
                  </div>
                </div>
              </div>
            )}

            {/* Right Column - Booking Summary */}
            {currentStep < 4 && (
              <div className="lg:w-[304px]">
                <div className="lg:sticky lg:top-24">
                  <BookingSummary />
                </div>
              </div>
            )}

            {/* Step 4 - Full Width Centered */}
            {currentStep === 4 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[600px] flex items-center justify-center min-h-screen">
                  <BookingStep4 />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with provider
const Booking: FunctionComponent = () => {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
};

export default Booking;