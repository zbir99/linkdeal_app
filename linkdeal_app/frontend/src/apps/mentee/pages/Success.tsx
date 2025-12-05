import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const Success: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/mentee/dashboard');
  };

  const handleJoinSession = () => {
    // Navigate to session or meeting link
    navigate('/mentee/session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden flex flex-col items-center justify-center pt-[142.9px] px-[357.7px]">
      {/* Background Blur Effects */}
      <div className="absolute top-[-144px] left-[-192px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
      <div className="absolute top-[230px] left-[-170px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      <div className="absolute top-[230px] left-[787px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />

      {/* Success Card */}
      <div className="relative z-10 w-[444px] h-[408.6px] rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md shrink-0 flex flex-col items-center pt-[32.8px] px-[32.8px]">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Success Title */}
        <div className="w-full h-[42px] text-[28px] font-inter text-white text-center mb-6">
          Booking Confirmed!
        </div>

        {/* Success Message */}
        <div className="w-full h-[21px] text-gray-400 text-center mb-12">
          <span className="text-[14px] font-arimo leading-[21px]">Your session with Marie Dupont is confirmed for Nov 26, 2024</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full h-24 flex flex-col items-start gap-2">
          <button
            onClick={handleGoToDashboard}
            className="w-full h-11 rounded-lg bg-[#7008E7] text-white font-arimo text-[14px] hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50 flex items-center justify-center"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleJoinSession}
            className="w-full h-11 rounded-lg bg-white border border-[#7008E7] text-[#7008E7] font-arimo text-[14px] hover:bg-[#7008E7] hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success as FunctionComponent;
