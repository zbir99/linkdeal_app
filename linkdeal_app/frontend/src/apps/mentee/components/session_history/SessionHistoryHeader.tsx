import { FunctionComponent } from 'react';

interface SessionHistoryHeaderProps {
  onBack: () => void;
}

const SessionHistoryHeader: FunctionComponent<SessionHistoryHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <button 
          onClick={onBack}
          className="rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl text-white font-inter">Session History</h1>
        <p className="text-base text-gray-500 font-arimo">
          View all your completed mentoring sessions
        </p>
      </div>
    </div>
  );
};

export default SessionHistoryHeader;

