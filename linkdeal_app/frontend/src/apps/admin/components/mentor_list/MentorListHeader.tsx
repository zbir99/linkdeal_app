import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface MentorListHeaderProps {
  pendingCount: number;
}

const MentorListHeader: FunctionComponent<MentorListHeaderProps> = ({ 
  pendingCount 
}) => {
  const navigate = useNavigate();
  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBackToDashboard}
        className="h-9 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white/70 font-medium transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
      >
        ← Back to Dashboard
      </button>
      
      {/* Mentors to Validate Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white leading-tight">
            Mentors to Validate
          </h1>
          <p className="text-base text-white/60">
            3 applications pending
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 text-sm font-arimo">
          <div className="h-9 px-4 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-300 font-medium whitespace-nowrap gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_161_10236)">
                <path d="M6 3V6L8 7" stroke="#FF8904" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#FF8904" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_161_10236">
                  <rect width="12" height="12" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            {pendingCount} Pending
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorListHeader;