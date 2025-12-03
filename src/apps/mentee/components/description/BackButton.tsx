import { FunctionComponent } from 'react';

interface BackButtonProps {
  onBack: () => void;
}

const BackButton: FunctionComponent<BackButtonProps> = ({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md w-auto h-9 flex items-center px-3 py-0 gap-3 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 whitespace-nowrap"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="leading-5">Back to Mentors</div>
    </button>
  );
};

export default BackButton;
