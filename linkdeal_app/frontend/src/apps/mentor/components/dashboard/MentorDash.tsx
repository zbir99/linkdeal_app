import { FunctionComponent } from 'react';
import WelcomeHeader from './WelcomeHeader';
import StatsCards from './StatsCards';
import SessionsChart from './SessionsChart';
import UpcomingSessions from './UpcomingSessions';
import RecentReviews from './RecentReviews';

const MentorDash: FunctionComponent = () => {
  return (
    <div className="w-full space-y-8 text-white font-inter">
      <WelcomeHeader />
      <StatsCards />
      <SessionsChart />
      
      {/* Two Column Layout for Sessions and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <UpcomingSessions />
        <RecentReviews />
      </div>
    </div>
  );
};

export default MentorDash;
