import { FunctionComponent, useState, useCallback } from 'react';
import api from '@/services/api';
import {
  SettingsHeader,
  FinancialSettings,
  SettingsActions
} from '../components/settings';

const Settings: FunctionComponent = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<{ platformFee: string; minSessionPrice: string } | null>(null);

  const handleSettingsChange = useCallback((settings: { platformFee: string; minSessionPrice: string }) => {
    setCurrentSettings(settings);
  }, []);

  const handleSave = async () => {
    if (!currentSettings) return;

    setIsSaving(true);
    setShowErrorMessage(false);

    try {
      await api.patch('/api/settings/platform/', {
        platform_fee_percentage: currentSettings.platformFee,
        min_session_price: currentSettings.minSessionPrice,
      });

      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects - Fixed to viewport */}
      <div className="fixed top-[-110px] left-[-24px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
      <div className="fixed top-[1119px] left-[527px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />

      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed top-[428px] left-[-46px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />
      <div className="fixed top-[751px] left-[164px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
          <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-green-400 font-medium text-sm sm:text-base">Settings saved successfully!</span>
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
            <span className="text-red-400 font-medium text-sm sm:text-base">Failed to save settings. Please try again.</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <SettingsHeader />

          {/* Settings Sections */}
          <div className="space-y-8">
            <FinancialSettings onSettingsChange={handleSettingsChange} />
          </div>

          {/* Action Buttons */}
          <SettingsActions onSave={handleSave} isSaving={isSaving} />
        </div>
      </div>
    </div>
  );
};

export default Settings;