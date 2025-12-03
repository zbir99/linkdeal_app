import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

export const PricingHeader: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/mentor/dashboard')}
        className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
      >
        ← Back
      </button>
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          Pricing Configuration
        </h1>
        <p className="text-base text-white/60">
          Set your mentoring session rates
        </p>
      </div>
    </div>
  );
};
