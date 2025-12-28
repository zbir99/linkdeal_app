import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionsHeader } from '../components/all_sessions/SessionsHeader';
import { SessionsStats } from '../components/all_sessions/SessionsStats';
import { SessionsList } from '../components/all_sessions/SessionsList';

const All_sessions: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[300px] left-[500px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SessionsHeader onBack={handleBack} />

        <div className="space-y-6">
          <SessionsStats />
          <SessionsList />
        </div>
      </div>
    </div>
  );
};

export default All_sessions;
