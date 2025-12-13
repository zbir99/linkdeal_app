import { FunctionComponent } from 'react';

interface AvailabilityActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

export const AvailabilityActions: FunctionComponent<AvailabilityActionsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onCancel}
        className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 transform"
      >
        Cancel
      </button>

      <button
        onClick={onSave}
        className="flex-1 px-6 py-3 rounded-lg bg-[#7008E7] text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 hover:bg-[#8B5CF6] hover:shadow-xl transition-all duration-300 transform flex items-center justify-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.6667 2.5C13.1063 2.50626 13.5256 2.68598 13.8333 3L17 6.16667C17.314 6.47438 17.4937 6.89372 17.5 7.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H12.6667Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.1666 17.5007V11.6673C14.1666 11.4463 14.0788 11.2343 13.9225 11.0781C13.7662 10.9218 13.5543 10.834 13.3333 10.834H6.66659C6.44557 10.834 6.23361 10.9218 6.07733 11.0781C5.92105 11.2343 5.83325 11.4463 5.83325 11.6673V17.5007" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.83325 2.5V5.83333C5.83325 6.05435 5.92105 6.26631 6.07733 6.42259C6.23361 6.57887 6.44557 6.66667 6.66659 6.66667H12.4999" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Save
      </button>
    </div>
  );
};
