import { FunctionComponent, useState, useEffect } from 'react';
import { PricingHeader, HourlyRateSection, EarningsPreview, PricingActions } from '../components/pricing';
import api from '@/services/api';

const Pricing: FunctionComponent = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Pricing state
  const [sessionRate, setSessionRate] = useState('0');
  const [currency, setCurrency] = useState('USD');

  // Platform settings
  const [minSessionPrice, setMinSessionPrice] = useState(0);

  // Fetch current session rate and platform settings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch mentor profile
        const profileResponse = await api.get('/auth/mentors/profile/me/');
        if (profileResponse.data.session_rate) {
          setSessionRate(profileResponse.data.session_rate);
        }

        // Fetch platform settings for min price validation
        const settingsResponse = await api.get('/api/settings/platform/');
        setMinSessionPrice(parseFloat(settingsResponse.data.min_session_price) || 50);

      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    // Validate against min session price
    const rate = parseFloat(sessionRate) || 0;
    if (rate < minSessionPrice) {
      setErrorMessage(`Minimum session rate is €${minSessionPrice}. Please increase your rate.`);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return;
    }

    try {
      setIsSaving(true);
      setShowErrorMessage(false);

      await api.patch('/auth/mentors/profile/me/', {
        session_rate: sessionRate
      });

      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error: any) {
      console.error('Failed to save pricing:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to save pricing');
      setShowErrorMessage(true);

      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden text-white font-arimo">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[15%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(233,212,255,0.25),transparent)] blur-[120px]" />
        <div className="absolute top-[420px] right-[10%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(128,51,208,0.35),transparent)] blur-[150px]" />
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
          <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-green-400 font-medium text-sm sm:text-base">Pricing saved successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-red-400 font-medium text-sm sm:text-base">{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <PricingHeader />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <HourlyRateSection
              hourlyRate={sessionRate}
              setHourlyRate={setSessionRate}
              currency={currency}
              setCurrency={setCurrency}
            />

            {/* Min Price Notice */}
            {minSessionPrice > 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                  <circle cx="10" cy="10" r="8" stroke="#60A5FA" strokeWidth="1.5" />
                  <path d="M10 6V10M10 14H10.01" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-blue-300">
                  Minimum session rate set by platform: <span className="font-semibold">€{minSessionPrice}</span>
                </p>
              </div>
            )}

            <EarningsPreview hourlyRate={sessionRate} currency={currency} />
            <PricingActions onSave={handleSave} isSaving={isSaving} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;