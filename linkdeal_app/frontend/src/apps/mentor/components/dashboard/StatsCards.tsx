import { FunctionComponent } from 'react';
import StatsCard from './StatsCard';

const StatsCards: FunctionComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <StatsCard 
        icon="users"
        badge="This month"
        title="Total Mentees"
        value="127"
      />
      <StatsCard 
        icon="money"
        badge="+12%"
        title="Monthly Earnings"
        value="€4,200"
      />
      <StatsCard 
        icon="star"
        title="Average Rating"
        value="4.9"
      />
    </div>
  );
};

export default StatsCards;
