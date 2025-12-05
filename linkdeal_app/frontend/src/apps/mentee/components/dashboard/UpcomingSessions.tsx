import { FunctionComponent, useState } from 'react';
import SessionDetailsModal from './SessionDetailsModal';

const UpcomingSessions: FunctionComponent = () => {
  const [selectedSession, setSelectedSession] = useState<{
    initials: string;
    name: string;
    topic: string;
    date: string;
    time: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailsClick = (session: typeof sessions[0]) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSession(null), 200); // Clear after animation
  };

  const sessions = [
    {
      id: 1,
      initials: 'SL',
      name: 'Sophie Laurent',
      topic: 'React Hooks',
      date: 'Monday, Nov 25',
      time: '2:00 PM'
    },
    {
      id: 2,
      initials: 'TD',
      name: 'Thomas Durand',
      topic: 'Node.js API',
      date: 'Tuesday, Nov 26',
      time: '10:00 AM'
    },
    {
      id: 3,
      initials: 'CM',
      name: 'Claire Martin',
      topic: 'TypeScript',
      date: 'Wednesday, Nov 27',
      time: '4:00 PM'
    }
  ];

  return (
    <div className="w-full rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Upcoming Sessions</h2>
      </div>
      
      <div className="flex flex-col gap-3 sm:gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            {/* Left: Avatar and Info */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#7008E7] flex items-center justify-center text-white font-semibold text-xs sm:text-sm md:text-base shrink-0">
                {session.initials}
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm sm:text-base truncate">{session.name}</div>
                <div className="text-gray-400 text-xs sm:text-sm truncate">{session.topic}</div>
              </div>
            </div>

            {/* Right: Date, Time, Button */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Date Badge */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#9CA3AF" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#9CA3AF" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#9CA3AF" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="#9CA3AF" strokeWidth="2"/>
                </svg>
                <span className="text-white whitespace-nowrap">{session.date}</span>
              </div>
              
              {/* Time Badge */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white whitespace-nowrap">{session.time}</span>
              </div>

              {/* Details Button */}
              <button
                onClick={() => handleDetailsClick(session)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#9B59B6] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        session={selectedSession}
      />
    </div>
  );
};

export default UpcomingSessions;

