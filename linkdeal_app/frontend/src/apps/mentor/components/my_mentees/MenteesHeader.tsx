import { FunctionComponent } from 'react';

interface MenteesHeaderProps {
  onBack: () => void;
}

export const MenteesHeader: FunctionComponent<MenteesHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <button
        onClick={onBack}
        className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 transform flex items-center gap-2 text-sm sm:text-base"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="hidden sm:inline">Back to Dashboard</span>
        <span className="sm:hidden">Back</span>
      </button>
      
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">My Mentees</h1>
        <p className="text-white/60 text-sm sm:text-base md:text-lg">Manage and track your mentees' progress</p>
      </div>
    </div>
  );
};
