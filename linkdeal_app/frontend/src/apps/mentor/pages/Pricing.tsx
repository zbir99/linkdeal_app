import { FunctionComponent, useState } from 'react';
import { PricingHeader, HourlyRateSection, SessionPackagesSection, EarningsPreview, PricingActions } from '../components/pricing';

const Pricing: FunctionComponent = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSave = () => {
    console.log('Pricing saved');
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-green-400 font-medium text-sm sm:text-base">Pricing saved successfully!</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <PricingHeader />
        <div className="space-y-6">
          <HourlyRateSection />
          <SessionPackagesSection />
          <EarningsPreview />
          <PricingActions onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default Pricing;