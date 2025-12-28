import { FunctionComponent, useState, useEffect } from 'react';
import api from '@/services/api';
import SessionDetailsModal from './SessionDetailsModal';

interface Session {
  id: string;
  scheduled_at: string;
  mentor?: {
    full_name: string;
    profile_picture_url?: string;
    social_picture_url?: string;
  };
  mentor_name?: string;
  session_type?: {
    name: string;
  };
  topic?: string;
  status: string;
  duration_minutes: number;
}

const UpcomingSessions: FunctionComponent = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<{
    id: string; // Added ID
    initials: string;
    name: string;
    topic: string;
    date: string;
    time: string;
    profilePicture?: string;
    duration?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('scheduling/sessions/');
        const allSessions = response.data;

        // Filter for upcoming sessions (pending or confirmed, scheduled in the future)
        const now = new Date();
        const upcomingSessions = allSessions
          .filter((s: Session) =>
            new Date(s.scheduled_at) > now &&
            (s.status === 'pending' || s.status === 'confirmed')
          )
          .sort((a: Session, b: Session) =>
            new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
          )
          .slice(0, 3); // Take only the 3 closest

        setSessions(upcomingSessions);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDetailsClick = (session: Session) => {
    const mentorName = session.mentor?.full_name || session.mentor_name || 'Mentor';
    const profilePic = session.mentor?.profile_picture_url || session.mentor?.social_picture_url;

    setSelectedSession({
      id: session.id, // Pass ID
      initials: getInitials(mentorName),
      name: mentorName,
      topic: session.topic || session.session_type?.name || 'Mentoring Session',
      date: formatDate(session.scheduled_at),
      time: formatTime(session.scheduled_at),
      profilePicture: profilePic,
      duration: `${session.duration_minutes || 60} minutes`,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSession(null), 200);
  };

  return (
    <div className="w-full rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Upcoming Sessions</h2>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : sessions.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
              <path d="M9 16l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-400 text-sm">No upcoming sessions</p>
            <p className="text-gray-500 text-xs mt-1">Book a session with a mentor to get started</p>
          </div>
        ) : (
          // Sessions list
          sessions.map((session) => {
            const mentorName = session.mentor?.full_name || session.mentor_name || 'Mentor';
            const topic = session.topic || session.session_type?.name || 'Mentoring Session';
            const profilePic = session.mentor?.profile_picture_url || session.mentor?.social_picture_url;

            return (
              <div
                key={session.id}
                className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                {/* Left: Avatar and Info */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={mentorName}
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#7008E7] flex items-center justify-center text-white font-semibold text-xs sm:text-sm md:text-base shrink-0">
                      {getInitials(mentorName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm sm:text-base truncate">{mentorName}</div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">{topic}</div>
                  </div>
                </div>

                {/* Right: Date, Time, Button */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Date Badge */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#9CA3AF" strokeWidth="2" />
                      <line x1="16" y1="2" x2="16" y2="6" stroke="#9CA3AF" strokeWidth="2" />
                      <line x1="8" y1="2" x2="8" y2="6" stroke="#9CA3AF" strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" stroke="#9CA3AF" strokeWidth="2" />
                    </svg>
                    <span className="text-white whitespace-nowrap">{formatDate(session.scheduled_at)}</span>
                  </div>

                  {/* Time Badge */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white whitespace-nowrap">{formatTime(session.scheduled_at)}</span>
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
            );
          })
        )}
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
