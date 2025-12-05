import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const VideoArea: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMainVideoSelf, setIsMainVideoSelf] = useState(false);

  const handleEndSession = () => {
    navigate('/mentor/dashboard');
  };

  const handleSwapVideos = () => {
    setIsMainVideoSelf(!isMainVideoSelf);
  };

  return (
    <div className="flex-1 bg-[#0a0a1a]/50 p-3 sm:p-4 md:p-6 flex flex-col min-h-[400px] sm:min-h-[500px] lg:min-h-0">
      <div className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
        {/* Main video */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isMainVideoSelf 
              ? 'bg-gradient-to-br from-blue-900/30 to-blue-700/30' 
              : 'bg-gradient-to-br from-purple-900/20 to-purple-700/20'
          }`}
        >
          <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-5xl font-bold shadow-2xl ${
            isMainVideoSelf
              ? 'bg-gradient-to-br from-blue-600 to-blue-400'
              : 'bg-gradient-to-br from-[#7008e7] to-[#a683ff]'
          }`}>
            {isMainVideoSelf ? 'JD' : 'EC'}
          </div>
        </div>

        {/* Picture-in-picture */}
        <div 
          className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-lg md:rounded-xl border-2 flex items-center justify-center overflow-hidden shadow-2xl cursor-pointer hover:border-purple-400 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 ${
            isMainVideoSelf
              ? 'bg-gradient-to-br from-purple-900/30 to-purple-700/30 border-purple-400/40'
              : 'bg-gradient-to-br from-blue-900/40 to-blue-700/40 border-blue-400/40'
          }`}
          onClick={handleSwapVideos}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-base sm:text-lg md:text-xl font-bold ${
            isMainVideoSelf
              ? 'bg-gradient-to-br from-[#7008e7] to-[#a683ff]'
              : 'bg-gradient-to-br from-blue-600 to-blue-400'
          }`}>
            {isMainVideoSelf ? 'EC' : 'JD'}
          </div>
        </div>

        {/* Video controls */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-black/60 backdrop-blur-md rounded-full px-2 sm:px-3 md:px-4 py-2 md:py-3 border border-white/10 shadow-xl">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
          >
            {isVideoOff ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M1 1l22 22M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m13.5 5.5l5.5-3v11l-5.5-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M23 7l-7 5 7 5V7zM16 5H2a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          <button 
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
            aria-label="Share screen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2v20M16 2v20M2 8h20M2 16h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={handleEndSession}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 flex items-center justify-center transition-all duration-200 shadow-lg"
            aria-label="End session"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
              <g clipPath="url(#clip0_end_session)">
                <path d="M6.73299 9.2666C7.45888 9.99226 8.2995 10.5932 9.22099 11.0453C9.35867 11.1085 9.51379 11.1229 9.66078 11.0862C9.80778 11.0495 9.93788 10.9638 10.0297 10.8433L10.2663 10.5333C10.3905 10.3677 10.5516 10.2333 10.7367 10.1407C10.9218 10.0481 11.126 9.99994 11.333 9.99994H13.333C13.6866 9.99994 14.0258 10.1404 14.2758 10.3905C14.5258 10.6405 14.6663 10.9796 14.6663 11.3333V13.3333C14.6663 13.6869 14.5258 14.026 14.2758 14.2761C14.0258 14.5261 13.6866 14.6666 13.333 14.6666C11.7571 14.6666 10.1967 14.3562 8.74077 13.7532C7.28485 13.1501 5.96197 12.2662 4.84766 11.1519" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.6663 1.33301L1.33301 14.6663" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.17301 9.05434C1.97034 7.14077 1.33253 4.92646 1.33301 2.66634C1.33301 2.31272 1.47348 1.97358 1.72353 1.72353C1.97358 1.47348 2.31272 1.33301 2.66634 1.33301H4.66634C5.01996 1.33301 5.3591 1.47348 5.60915 1.72353C5.8592 1.97358 5.99967 2.31272 5.99967 2.66634V4.66634C5.99967 4.87333 5.95148 5.07749 5.85891 5.26263C5.76634 5.44777 5.63194 5.60881 5.46634 5.73301L5.15434 5.96701C5.03195 6.06046 4.94569 6.1934 4.9102 6.34324C4.87472 6.49308 4.8922 6.65059 4.95967 6.78901C5.01189 6.89514 5.06613 7.00027 5.12234 7.10434" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_end_session">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoArea as FunctionComponent;
