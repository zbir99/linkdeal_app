import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';

interface SessionCounts {
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

interface StatsData {
  total_mentees: number;
  active_mentees: number;
  total_sessions: number;
  average_rating: number | null;
  session_counts?: SessionCounts;
}

export const MenteesStats: FunctionComponent = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/mentoring/mentor/mentees/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch mentees stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const sessionCounts = stats?.session_counts || {
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  };

  const mainStatsConfig = [
    {
      label: 'Total Mentees',
      value: stats?.total_mentees ?? 0,
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#7008E7" fillOpacity="0.2" />
          <path d="M26.6667 28.3327V25.8327C26.6667 24.5406 26.1536 23.3014 25.2409 22.3887C24.3282 21.476 23.089 20.9627 21.7969 20.9627H18.2031C16.911 20.9627 15.6718 21.476 14.7591 22.3887C13.8464 23.3014 13.3333 24.5406 13.3333 25.8327V28.3327" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 17.9167C21.6109 17.9167 22.9167 16.6109 22.9167 15C22.9167 13.3891 21.6109 12.0833 20 12.0833C18.3891 12.0833 17.0833 13.3891 17.0833 15C17.0833 16.6109 18.3891 17.9167 20 17.9167Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: 'Active',
      value: stats?.active_mentees ?? 0,
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#22C55E" fillOpacity="0.2" />
          <path d="M28.3333 14.166L17.9167 24.5827L13.3333 19.9993" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: 'Avg Rating',
      value: stats?.average_rating ? parseFloat(String(stats.average_rating)).toFixed(1) : '-',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#FBBF24" fillOpacity="0.2" />
          <path d="M19.6042 11.9118C19.6407 11.838 19.6971 11.7759 19.7671 11.7324C19.837 11.689 19.9177 11.666 20 11.666C20.0824 11.666 20.163 11.689 20.233 11.7324C20.3029 11.7759 20.3593 11.838 20.3959 11.9118L22.3209 15.8109C22.4477 16.0676 22.6349 16.2896 22.8664 16.458C23.0979 16.6263 23.3668 16.736 23.65 16.7776L27.955 17.4076C28.0366 17.4194 28.1132 17.4538 28.1763 17.5069C28.2393 17.56 28.2862 17.6297 28.3117 17.7081C28.3372 17.7865 28.3403 17.8704 28.3205 17.9505C28.3008 18.0305 28.259 18.1034 28.2 18.1609L25.0867 21.1926C24.8814 21.3927 24.7278 21.6397 24.6391 21.9123C24.5504 22.1849 24.5292 22.475 24.5775 22.7576L25.3125 27.0409C25.3269 27.1225 25.3181 27.2064 25.2871 27.2832C25.2561 27.3599 25.2041 27.4264 25.1371 27.4751C25.0702 27.5237 24.9908 27.5526 24.9082 27.5583C24.8257 27.5641 24.7431 27.5465 24.67 27.5076L20.8217 25.4843C20.5681 25.3511 20.286 25.2816 19.9996 25.2816C19.7132 25.2816 19.4311 25.3511 19.1775 25.4843L15.33 27.5076C15.257 27.5463 15.1745 27.5637 15.0921 27.5578C15.0096 27.5519 14.9305 27.5231 14.8636 27.4744C14.7968 27.4258 14.7449 27.3594 14.7139 27.2828C14.6829 27.2061 14.6741 27.1223 14.6884 27.0409L15.4225 22.7584C15.471 22.4757 15.45 22.1854 15.3613 21.9126C15.2726 21.6398 15.1189 21.3927 14.9134 21.1926L11.8 18.1618C11.7405 18.1043 11.6984 18.0313 11.6783 17.951C11.6583 17.8707 11.6612 17.7864 11.6868 17.7078C11.7123 17.6291 11.7594 17.5591 11.8228 17.5059C11.8861 17.4527 11.9631 17.4183 12.045 17.4068L16.3492 16.7776C16.6327 16.7363 16.902 16.6268 17.1338 16.4584C17.3657 16.29 17.5531 16.0678 17.68 15.8109L19.6042 11.9118Z" stroke="#FBBF24" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const sessionStatsConfig = [
    { label: 'Upcoming', value: sessionCounts.pending + sessionCounts.confirmed, color: 'bg-yellow-500/20', textColor: 'text-yellow-300', borderColor: 'border-yellow-500/30' },
    { label: 'In Progress', value: sessionCounts.in_progress, color: 'bg-purple-500/20', textColor: 'text-purple-300', borderColor: 'border-purple-500/30' },
    { label: 'Completed', value: sessionCounts.completed, color: 'bg-green-500/20', textColor: 'text-green-300', borderColor: 'border-green-500/30' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg" />
                <div className="flex-1">
                  <div className="h-8 bg-white/10 rounded w-16 mb-1" />
                  <div className="h-4 bg-white/10 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-8 mb-1 mx-auto" />
              <div className="h-3 bg-white/10 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {mainStatsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 transform group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0">
                {stat.icon}
              </div>
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session Status Breakdown */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-sm group hover:border-purple-400/20 transition-all duration-500">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#A684FF" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Sessions by Status</h3>
              <p className="text-xs text-white/50">Overview of all your session statuses</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {sessionStatsConfig.map((stat, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl ${stat.color} border ${stat.borderColor} p-4 sm:p-5 text-center group/card hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 ${stat.color} opacity-0 group-hover/card:opacity-50 blur-xl transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor} mb-1 drop-shadow-sm`}>
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

