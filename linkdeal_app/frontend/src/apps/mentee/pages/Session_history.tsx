import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { SessionHistoryHeader } from '../components/session_history';

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
  price?: string;
  currency?: string;
  rating?: number;
  feedback?: string;
}

const SessionHistory: FunctionComponent = () => {
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
          );

        setSessions(completedSessions);
      } catch (error) {
        console.error('Error fetching completed sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleBack = () => {
    navigate('/mentee/dashboard');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string, durationMinutes: number) => {
    const start = new Date(dateString);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${startTime} - ${endTime}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="hidden md:block">
        <div className="fixed top-[-216px] left-[204.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[497px] left-[145.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[28px] left-[637.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Additional background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <SessionHistoryHeader onBack={handleBack} />

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/10" />
                    <div className="flex-1">
                      <div className="h-5 bg-white/10 rounded w-40 mb-3" />
                      <div className="h-4 bg-white/10 rounded w-60 mb-2" />
                      <div className="flex gap-3">
                        <div className="h-8 bg-white/10 rounded w-32" />
                        <div className="h-8 bg-white/10 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            // Empty state - modern purple stylish design
            <div className="flex flex-col items-center justify-center py-20 px-4">
              {/* Animated gradient circle */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7008E7] to-[#9B4DFF] rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#7008E7]/20 to-[#9B4DFF]/20 border-2 border-[#7008E7]/40 flex items-center justify-center backdrop-blur-sm">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 12V18" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 12V18" stroke="url(#paint1_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="10" y="16" width="28" height="24" rx="3" stroke="url(#paint2_linear)" strokeWidth="3" />
                    <line x1="10" y1="24" x2="38" y2="24" stroke="url(#paint3_linear)" strokeWidth="3" />
                    <path d="M20 32L24 36L28 32" stroke="#A684FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="18" y1="12" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A684FF" />
                        <stop offset="1" stopColor="#7008E7" />
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="30" y1="12" x2="30" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A684FF" />
                        <stop offset="1" stopColor="#7008E7" />
                      </linearGradient>
                      <linearGradient id="paint2_linear" x1="10" y1="16" x2="38" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A684FF" />
                        <stop offset="1" stopColor="#7008E7" />
                      </linearGradient>
                      <linearGradient id="paint3_linear" x1="10" y1="24" x2="38" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A684FF" />
                        <stop offset="1" stopColor="#7008E7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl text-white font-bold mb-3 bg-gradient-to-r from-white to-[#A684FF] bg-clip-text text-transparent">
                No Sessions Found
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-8 leading-relaxed">
                You haven't completed any mentoring sessions yet. Once you complete a session with a mentor, it will appear here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/mentee/find-mentor')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white font-semibold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Find a Mentor
                </button>
                <button
                  onClick={handleBack}
                  className="px-8 py-3.5 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/5 hover:border-white/30 transition-all duration-300 flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            // Sessions list
            <div className="space-y-6">
              {sessions.map((session) => {
                const mentorName = session.mentor?.full_name || session.mentor_name || 'Mentor';
                const topic = session.topic || session.session_type_name || 'Mentoring Session';
                const rating = session.rating || 0;

                return (
                  <div
                    key={session.id}
                    className="rounded-2xl bg-[#1E1E2E] border border-white/5 p-6 hover:border-white/10 transition-colors duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                      {/* Left Side: Avatar + Details */}
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {session.mentor?.profile_picture_url ? (
                            <img
                              src={session.mentor.profile_picture_url}
                              alt={mentorName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#7008E7] flex items-center justify-center text-white font-bold text-sm">
                              {getInitials(mentorName)}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <h3 className="text-white font-semibold text-lg leading-tight">{mentorName}</h3>
                          <p className="text-[#A684FF] text-sm font-medium">{topic}</p>

                          {/* Badges Row */}
                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mt-2">
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              <span>{formatDate(session.scheduled_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>{formatTime(session.scheduled_at, session.duration_minutes)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>{formatDuration(session.duration_minutes)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Price & Rating */}
                      <div className="flex flex-row md:flex-col justify-between md:items-end gap-2 md:text-right min-w-[120px]">
                        <div>
                          <div className="text-[#05DF72] text-xl font-bold font-mono tracking-wide">
                            ${parseFloat(session.price || '0').toLocaleString()}
                          </div>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={star <= rating ? "#FFD700" : "none"}
                                stroke={star <= rating ? "#FFD700" : "#4B5563"}
                                strokeWidth="2"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <div className="text-gray-500 text-xs mt-1 font-medium">Completed</div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-[#262638] rounded-xl p-5 border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-[#A684FF]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-medium">Feedback</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {session.feedback || "No feedback of this session"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
