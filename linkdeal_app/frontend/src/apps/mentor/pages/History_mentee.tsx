import { FunctionComponent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HistoryHeader } from '../components/history_mentee/HistoryHeader';
import { MenteeProfileCard } from '../components/history_mentee/MenteeProfileCard';
import { SessionHistoryList } from '../components/history_mentee/SessionHistoryList';

const HistoryMentee: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mentee = location.state?.mentee;

  const handleBack = () => {
    navigate('/mentor/my-mentees');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[140px] left-[517px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <HistoryHeader onBack={handleBack} menteeName={mentee?.name} />

        <div className="space-y-4 sm:space-y-6">
          <MenteeProfileCard mentee={mentee} />
          <SessionHistoryList menteeId={mentee?.id} />
        </div>
      </div>
    </div>
  );
};

export default HistoryMentee;

