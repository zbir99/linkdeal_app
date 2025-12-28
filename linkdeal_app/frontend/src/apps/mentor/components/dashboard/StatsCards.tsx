import { FunctionComponent, useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import api from '@/services/api';

interface StatsData {
  total_mentees?: number;
  active_mentees?: number;
  total_sessions: number;
  completed_sessions: number;
  total_earned: string;
  average_rating: number | null;
  this_month_sessions: number;
}

const StatsCards: FunctionComponent = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch session and mentee stats
        const [sessionStatsRes, menteeStatsRes] = await Promise.all([
          api.get('/scheduling/sessions/stats/'),
          api.get('/mentoring/mentor/mentees/stats/').catch(() => ({ data: null }))
        ]);

        setStats({
          ...sessionStatsRes.data,
          total_mentees: menteeStatsRes.data?.total_mentees,
          active_mentees: menteeStatsRes.data?.active_mentees,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 min-h-[180px] md:min-h-[200px] animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg" />
              <div className="h-4 bg-white/10 rounded w-24" />
            </div>
            <div className="h-8 bg-white/10 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  // Format monthly earnings with $ prefix
  const totalEarned = stats?.total_earned
    ? `$${parseFloat(String(stats.total_earned)).toFixed(0)}`
    : '$0';

  // Calculate this month badge
  const thisMonthBadge = stats?.this_month_sessions
    ? `${stats.this_month_sessions} this month`
    : 'This month';

  // Format average rating
  const avgRating = stats?.average_rating
    ? parseFloat(String(stats.average_rating)).toFixed(1)
    : '-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <StatsCard
        icon="users"
        badge={thisMonthBadge}
        title="Total Mentees"
        value={String(stats?.total_mentees ?? stats?.completed_sessions ?? 0)}
      />
      <StatsCard
        icon="money"
        badge="Total"
        title="Total Earnings"
        value={totalEarned}
      />
      <StatsCard
        icon="star"
        title="Average Rating"
        value={avgRating}
      />
    </div>
  );
};

export default StatsCards;
