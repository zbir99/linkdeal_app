import { FunctionComponent } from 'react';

interface SupportHeaderProps {
  onBackToDashboard: () => void;
}

const SupportHeader: FunctionComponent<SupportHeaderProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBackToDashboard}
        className="h-9 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white/70 font-medium transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
      >
        ← Back to Dashboard
      </button>
      
      {/* Page Title and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold text-white leading-tight">
            Support Tickets
          </h1>
          <p className="text-base text-white/60">
            Manage and respond to user support requests
          </p>
        </div>
        
        {/* Status Badges */}
        <div className="flex items-center gap-2 text-sm font-arimo">
          <div className="h-9 px-4 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-300 font-medium whitespace-nowrap">
            2 Open
          </div>
          <div className="h-9 px-4 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-medium whitespace-nowrap">
            2 In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHeader;
