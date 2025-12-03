import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

const ChatHeader: FunctionComponent<ChatHeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full border-b border-white/10 flex flex-col p-4 sm:p-6 gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 15H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-inter font-semibold">AI Coach</h1>
        </div>
        
        <button
          onClick={() => navigate('/mentee/dashboard')}
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-400 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
        >
          ← Back
        </button>
      </div>
      <p className="text-xs sm:text-sm text-gray-400 font-arimo ml-10 md:ml-0">
        Your personal learning assistant
      </p>
    </div>
  );
};

export default ChatHeader;
