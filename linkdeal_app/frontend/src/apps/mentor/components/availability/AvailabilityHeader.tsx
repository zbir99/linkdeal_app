import { FunctionComponent } from 'react';

interface AvailabilityHeaderProps {
  onBack: () => void;
}

export const AvailabilityHeader: FunctionComponent<AvailabilityHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 transform"
      >
        ← Back
      </button>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Availability Management</h1>
        <p className="text-white/60 text-lg">Set your weekly availability for mentoring sessions</p>
      </div>
    </div>
  );
};
