import { FunctionComponent, useEffect, useState } from 'react';
import { SessionCard } from './SessionCard';
import api from '@/services/api';

interface Session {
  id: string;
  title: string;
  status: string;
  date: string;
  time: string;
  duration: string;
  rating: number | null;
  topic: string;
  feedback: string;
}

interface ApiSession {
  id: string;
  topic?: string;
  status: string;
  scheduled_at: string;
  duration_minutes: number;
  rating?: number | null;
  feedback?: string;
  mentor_notes?: string;
  session_type?: {
    name: string;
  };
}

interface SessionHistoryListProps {
  menteeId?: string;
}

export const SessionHistoryList: FunctionComponent<SessionHistoryListProps> = ({ menteeId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menteeId) {
      fetchSessions();
    } else {
      setIsLoading(false);
    }
  }, [menteeId]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all sessions for this mentee (no status filter to get all)
      const response = await api.get('/scheduling/sessions/', {
        params: {
          mentee_id: menteeId
        }
      });

      const rawSessions: ApiSession[] = response.data.results || response.data || [];

      // Transform API data to component format
      const transformedSessions = rawSessions.map((session: ApiSession): Session => {
        const scheduledDate = new Date(session.scheduled_at);
        const endTime = new Date(scheduledDate.getTime() + session.duration_minutes * 60000);

        return {
          id: session.id,
          title: session.topic || session.session_type?.name || 'Mentoring Session',
          status: mapStatus(session.status),
          date: scheduledDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          time: `${scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          duration: formatDuration(session.duration_minutes),
          rating: session.rating ?? null,
          topic: session.topic || 'No topic specified',
          feedback: session.mentor_notes || session.feedback || 'No feedback provided'
        };
      });

      // Sort by date (newest first)
      transformedSessions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setSessions(transformedSessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load session history');
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatus = (apiStatus: string): Session['status'] => {
    switch (apiStatus) {
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      case 'pending':
      case 'confirmed':
        return 'scheduled';
      case 'in_progress':
        return 'in_progress';
      case 'no_show':
        return 'no_show';
      default:
        return 'scheduled';
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-6 bg-white/10 rounded w-48" />
              <div className="h-6 bg-white/10 rounded w-24" />
            </div>
            <div className="h-4 bg-white/10 rounded w-full mb-2" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchSessions}
          className="mt-4 px-4 py-2 bg-[#7008E7] rounded-lg text-white text-sm hover:bg-[#8B5CF6] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">No Session History</h3>
        <p className="text-white/60 text-sm">No sessions have been recorded with this mentee yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-medium mb-4">Session History ({sessions.length})</h2>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};
