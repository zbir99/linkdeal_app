import { FunctionComponent } from 'react';

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
}

const ActionButtons: FunctionComponent<ActionButtonsProps> = ({ onApprove, onReject }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Actions</h3>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Approve Button */}
        <button
          onClick={onApprove}
          className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="truncate">Approve Mentor</span>
        </button>

        {/* Reject Button */}
        <button
          onClick={onReject}
          className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="truncate">Reject Application</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
