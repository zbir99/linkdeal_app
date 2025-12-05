import { FunctionComponent } from 'react';

interface ActionButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
  canSubmit: boolean;
}

const ActionButtons: FunctionComponent<ActionButtonsProps> = ({ onSubmit, onCancel, canSubmit }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 text-white">
      <button
        onClick={onCancel}
        className="flex-1 rounded-2xl border border-white/20 bg-transparent py-3 px-4 text-gray-200 transition-colors hover:border-white/50 hover:text-white"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`flex-1 rounded-2xl py-3 px-4 font-semibold transition-colors ${
          canSubmit
            ? 'bg-[#7008E7] text-white hover:bg-[#5a07b8]'
            : 'bg-[#7008E7]/60 text-white/70 cursor-not-allowed'
        }`}
      >
        Submit Ticket
      </button>
    </div>
  );
};

export { ActionButtons };
