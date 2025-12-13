import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface PricingActionsProps {
  onSave?: () => void;
}

export const PricingActions: FunctionComponent<PricingActionsProps> = ({ onSave }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/mentor/dashboard');
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Fallback behavior
      console.log('Pricing saved');
      navigate('/mentor/dashboard');
    }
  };

  return (
    <div className="flex gap-4 pt-4">
      <button
        onClick={handleCancel}
        className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
      >
        Cancel
      </button>
      
      <button
        onClick={handleSave}
        className="flex-1 h-12 px-4 rounded-xl bg-[#7008E7] text-white hover:bg-[#6007c5] hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.8334 2.5H4.16671C3.24623 2.5 2.50004 3.24619 2.50004 4.16667V15.8333C2.50004 16.7538 3.24623 17.5 4.16671 17.5H15.8334C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8334 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.1666 2.5V7.5H5.83329V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.1666 12.5H5.83329V17.5H14.1666V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Save Pricing
      </button>
    </div>
  );
};
