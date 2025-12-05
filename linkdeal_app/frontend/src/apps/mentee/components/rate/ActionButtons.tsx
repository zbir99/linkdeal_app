import { FunctionComponent } from 'react';

interface ActionButtonsProps {
  onSubmit: () => void;
  onSkip: () => void;
  canSubmit: boolean;
}

const ActionButtons: FunctionComponent<ActionButtonsProps> = ({ onSubmit, onSkip, canSubmit }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full text-base font-arimo text-white">
      <button
        type="button"
        onClick={onSkip}
        className="flex-1 rounded-2xl border border-white/30 bg-transparent py-3 px-6 text-white/80 transition-colors hover:border-white/60 hover:text-white"
      >
        Skip
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`flex-1 rounded-2xl py-3 px-6 font-semibold transition-colors ${
          canSubmit
            ? 'bg-[#7008E7] text-white hover:bg-[#5a07b8]'
            : 'bg-[#7008E7]/70 text-white/70 cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export { ActionButtons };
