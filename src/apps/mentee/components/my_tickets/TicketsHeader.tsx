import { FunctionComponent } from 'react';

interface TicketsHeaderProps {
  onBack: () => void;
}

export const TicketsHeader: FunctionComponent<TicketsHeaderProps> = ({ onBack }) => {
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
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">Support Tickets</h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">Respond to admin</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium">
            2 Open
          </div>
          <div className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
            2 In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

