import { FunctionComponent } from 'react';
import MentorDash from '../components/dashboard/MentorDash';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard: FunctionComponent = () => {
  return (
    <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]" />

      <QuickActions />

      <div className="relative z-10 w-full px-4 pl-24 md:pl-28 md:pr-12 py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-[2000px] mx-auto">
          <MentorDash />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;