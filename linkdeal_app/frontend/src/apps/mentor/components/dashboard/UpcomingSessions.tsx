import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';
import SessionItem from './SessionItem';

interface BackendSession {
  id: string;
  mentee: {
    id: string;
    full_name: string;
    profile_picture_url: string | null;
    social_picture_url: string | null;
  };
  session_type_name: string;
  scheduled_at: string;
  topic: string;
}

interface SessionData {
  id: string;
  initials: string;
  name: string;
  profileImage: string | null;
  topic: string;
  date: string;
  time: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const UpcomingSessions: FunctionComponent = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const response = await api.get('/scheduling/sessions/', {
          params: { status: 'upcoming' }
        });

        // Map backend data to component format and limit to 3 sessions
        const mappedSessions = response.data.slice(0, 3).map((session: BackendSession) => ({
          id: session.id,
          initials: getInitials(session.mentee.full_name),
          name: session.mentee.full_name,
          profileImage: session.mentee.profile_picture_url || session.mentee.social_picture_url,
          topic: session.topic || session.session_type_name || 'Mentoring Session',
          date: formatDate(session.scheduled_at),
          time: formatTime(session.scheduled_at)
        }));

        setSessions(mappedSessions);
      } catch (error) {
        console.error('Failed to fetch upcoming sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="h-5 bg-white/10 rounded w-36" />
          </div>
          <div className="h-4 bg-white/10 rounded w-48" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 md:p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-24" />
                </div>
                <div className="h-8 bg-white/10 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
      <div>
        <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upcoming Sessions
        </h2>
        <p className="text-xs md:text-sm text-white/60">Stay prepared for your mentees</p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionItem key={session.id} {...session} />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A684FF" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">No upcoming sessions</p>
            <p className="text-white/40 text-xs mt-1">Your next sessions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;
