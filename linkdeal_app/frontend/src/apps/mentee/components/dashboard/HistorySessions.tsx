import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface Session {
  id: string;
  scheduled_at: string;
  mentor?: {
    full_name: string;
    profile_picture_url?: string;
  };
  mentor_name?: string;
  topic?: string;
  session_type_name?: string;
  status: string;
  duration_minutes: number;
}

const HistorySessions: FunctionComponent = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('scheduling/sessions/');
        const allSessions = response.data;

        // Filter for completed sessions and sort by date (most recent first)
        const completedSessions = allSessions
          .filter((s: Session) => s.status === 'completed')
          .sort((a: Session, b: Session) =>
            new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
          )
          .slice(0, 3); // Take only the 3 most recent

        setSessions(completedSessions);
      } catch (error) {
        console.error('Error fetching completed sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const onViewAllClick = () => {
    navigate('/mentee/session-history');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
          </svg>
          <h2 className="text-lg font-semibold text-white">History</h2>
        </div>

        {/* View All Button */}
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_508_1892)">
              <path d="M0.693111 5.40003C0.638755 5.25477 0.638755 5.09498 0.693111 4.94974C1.22252 3.6764 2.12116 2.58767 3.27511 1.82157C4.42906 1.05547 5.78634 0.646484 7.17489 0.646484C8.56345 0.646484 9.92081 1.05547 11.0748 1.82157C12.2287 2.58767 13.1273 3.6764 13.6567 4.94974C13.7111 5.09498 13.7111 5.25477 13.6567 5.40003C13.1273 6.67335 12.2287 7.76211 11.0748 8.52819C9.92081 9.29427 8.56345 9.7033 7.17489 9.7033C5.78634 9.7033 4.42906 9.29427 3.27511 8.52819C2.12116 7.76211 1.22252 6.67335 0.693111 5.40003Z" stroke="white" strokeWidth="1.29918" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g clipPath="url(#clip1_508_1892)">
              <path d="M7.04258 6.81758C8.02289 6.81758 8.81754 6.02289 8.81754 5.04258C8.81754 4.06227 8.02289 3.26758 7.04258 3.26758C6.06227 3.26758 5.26758 4.06227 5.26758 5.04258C5.26758 6.02289 6.06227 6.81758 7.04258 6.81758Z" stroke="white" strokeWidth="1.18333" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_508_1892">
                <rect width="14.675" height="10.675" fill="white" />
              </clipPath>
              <clipPath id="clip1_508_1892">
                <rect width="5.325" height="5.325" fill="white" transform="translate(4.67578 2.67578)" />
              </clipPath>
            </defs>
          </svg>
          View All
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : sessions.length === 0 ? (
          // Empty state - modern purple style
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#7008E7]/20 to-[#9B4DFF]/20 border border-[#7008E7]/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
                <path d="M22 22L19 19" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm font-medium mb-1">No sessions yet</p>
            <p className="text-gray-500 text-xs text-center">Complete a session to see it here</p>
          </div>
        ) : (
          // Sessions list
          sessions.map((session) => {
            const mentorName = session.mentor?.full_name || session.mentor_name || 'Mentor';
            const topic = session.topic || session.session_type_name || 'Mentoring Session';

            return (
              <div
                key={session.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
                onClick={() => navigate(`/mentee/session-history`)}
              >
                <div className="flex items-center gap-3">
                  {session.mentor?.profile_picture_url ? (
                    <img
                      src={session.mentor.profile_picture_url}
                      alt={mentorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#7008E7] flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(mentorName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{mentorName}</div>
                    <div className="text-gray-400 text-xs truncate">{topic}</div>
                  </div>
                  <div className="text-gray-500 text-xs whitespace-nowrap">
                    {getTimeAgo(session.scheduled_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistorySessions;
