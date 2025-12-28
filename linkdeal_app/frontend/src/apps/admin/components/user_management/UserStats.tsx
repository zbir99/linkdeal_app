import { FunctionComponent, useState, useEffect } from 'react';
import api from '@/services/api';

const UserStats: FunctionComponent = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    mentors: 0,
    mentees: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch approved mentors
        const mentorsResponse = await api.get('/auth/admin/mentors/pending/?status=approved');
        const mentorsCount = mentorsResponse.data.count ?? mentorsResponse.data.length ?? 0;

        // Fetch rejected mentors
        const rejectedMentorsResponse = await api.get('/auth/admin/mentors/pending/?status=rejected');
        const rejectedMentorsCount = rejectedMentorsResponse.data.count ?? rejectedMentorsResponse.data.length ?? 0;

        // Fetch active mentees
        const menteesResponse = await api.get('/auth/admin/mentees/?status=active');
        const menteesCount = menteesResponse.data.count ?? menteesResponse.data.length ?? 0;

        // Fetch pending mentors
        const pendingMentorsResponse = await api.get('/auth/admin/mentors/pending/?status=pending');
        const pendingMentorsCount = pendingMentorsResponse.data.count ?? pendingMentorsResponse.data.length ?? 0;

        // Fetch banned mentors (for calculating total)
        const bannedMentorsResponse = await api.get('/auth/admin/mentors/pending/?status=banned');
        const bannedMentorsCount = bannedMentorsResponse.data.count ?? bannedMentorsResponse.data.length ?? 0;

        // Fetch banned mentees
        const bannedMenteesResponse = await api.get('/auth/admin/mentees/?status=banned');
        const bannedMenteesCount = bannedMenteesResponse.data.count ?? bannedMenteesResponse.data.length ?? 0;

        const totalMentors = mentorsCount + bannedMentorsCount + rejectedMentorsCount + pendingMentorsCount;
        const totalMentees = menteesCount + bannedMenteesCount;
        const totalUsers = totalMentors + totalMentees;
        const activeUsers = mentorsCount + menteesCount;

        setStats({
          totalUsers,
          activeUsers,
          mentors: totalMentors,
          mentees: totalMentees
        });
      } catch (error) {
        console.error('Failed to fetch user stats', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Users */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Total Users
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          {stats.totalUsers}
        </div>
      </div>

      {/* Active Users */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Active Users
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          {stats.activeUsers}
        </div>
      </div>

      {/* Mentors */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Mentors
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          {stats.mentors}
        </div>
      </div>

      {/* Mentees */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Mentees
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          {stats.mentees}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
