import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/mentee/dashboard');
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/40 hover:text-white"
    >
      <span className="text-lg leading-none">←</span>
      Back to Dashboard
    </button>
  );
};

export { BackButton };
