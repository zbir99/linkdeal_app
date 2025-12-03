import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const AIChatButton: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/mentee/ai-chat');
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      onClick={handleClick}
    >
      {/* Tooltip - appears on hover */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 shadow-xl">
          <div className="text-sm text-white font-medium mb-1 whitespace-nowrap">AI Coach</div>
          <div className="text-xs text-gray-400 whitespace-nowrap">Ask me anything!</div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/20"></div>
      </div>

      {/* Chat button */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7008E7] to-[#8E51FF] opacity-65 blur-sm"></div>
        
        {/* Main button */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#7008E7] to-[#8E51FF] shadow-[0px_10px_30px_-3px_rgba(112,8,231,0.6),_0px_4px_20px_-4px_rgba(112,8,231,0.6)] flex items-center justify-center hover:scale-110 transition-transform duration-300">
          {/* AI Robot icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V4H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 14H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 14H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 13V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* AI Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="#A684FF"/>
              <g clipPath="url(#clip0_508_2118)">
                <path d="M9.50774 5.40722C9.52917 5.29252 9.59003 5.18893 9.67979 5.11438C9.76955 5.03983 9.88256 4.99902 9.99924 4.99902C10.1159 4.99902 10.2289 5.03983 10.3187 5.11438C10.4085 5.18893 10.4693 5.29252 10.4907 5.40722L11.0162 8.18622C11.0536 8.38379 11.1496 8.56553 11.2918 8.70771C11.4339 8.84988 11.6157 8.9459 11.8132 8.98322L14.5922 9.50872C14.7069 9.53014 14.8105 9.59101 14.8851 9.68077C14.9596 9.77053 15.0004 9.88354 15.0004 10.0002C15.0004 10.1169 14.9596 10.2299 14.8851 10.3197C14.8105 10.4094 14.7069 10.4703 14.5922 10.4917L11.8132 11.0172C11.6157 11.0545 11.4339 11.1506 11.2918 11.2927C11.1496 11.4349 11.0536 11.6166 11.0162 11.8142L10.4907 14.5932C10.4693 14.7079 10.4085 14.8115 10.3187 14.8861C10.2289 14.9606 10.1159 15.0014 9.99924 15.0014C9.88256 15.0014 9.76955 14.9606 9.67979 14.8861C9.59003 14.8115 9.52917 14.7079 9.50774 14.5932L8.98224 11.8142C8.94492 11.6166 8.84891 11.4349 8.70673 11.2927C8.56455 11.1506 8.38282 11.0545 8.18524 11.0172L5.40624 10.4917C5.29155 10.4703 5.18795 10.4094 5.1134 10.3197C5.03885 10.2299 4.99805 10.1169 4.99805 10.0002C4.99805 9.88354 5.03885 9.77053 5.1134 9.68077C5.18795 9.59101 5.29155 9.53014 5.40624 9.50872L8.18524 8.98322C8.38282 8.9459 8.56455 8.84988 8.70673 8.70771C8.84891 8.56553 8.94492 8.38379 8.98224 8.18622L9.50774 5.40722Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 5V7" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 6H13" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 15C6.55228 15 7 14.5523 7 14C7 13.4477 6.55228 13 6 13C5.44772 13 5 13.4477 5 14C5 14.5523 5.44772 15 6 15Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_508_2118">
                  <rect width="12" height="12" fill="white" transform="translate(4 4)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatButton;

