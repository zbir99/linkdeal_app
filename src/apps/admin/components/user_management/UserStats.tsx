import { FunctionComponent } from 'react';

const UserStats: FunctionComponent = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Users */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Total Users
          </div>
          <div className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-lg bg-green-500/20 border-green-500/30 flex items-center justify-center text-green-400 text-[10px] sm:text-xs font-medium">
            +12%
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          7
        </div>
      </div>

      {/* Active Users */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Active Users
          </div>
          <div className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-lg bg-green-500/20 border-green-500/30 flex items-center justify-center text-green-400 text-[10px] sm:text-xs font-medium">
            +8%
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          5
        </div>
      </div>

      {/* Mentors */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Mentors
          </div>
          <div className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-lg bg-green-500/20 border-green-500/30 flex items-center justify-center text-green-400 text-[10px] sm:text-xs font-medium">
            +5%
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          3
        </div>
      </div>

      {/* Mentees */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 hover:bg-white/10 hover:border-white/20 cursor-pointer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="text-white/80 text-xs sm:text-sm font-medium">
            Mentees
          </div>
          <div className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-lg bg-green-500/20 border-green-500/30 flex items-center justify-center text-green-400 text-[10px] sm:text-xs font-medium">
            +15%
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-semibold text-white">
          3
        </div>
      </div>
    </div>
  );
};

export default UserStats;
