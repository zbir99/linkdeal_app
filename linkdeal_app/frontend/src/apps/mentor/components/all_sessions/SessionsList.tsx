import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';
import { SessionCard } from './SessionCard';

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
    duration_minutes: number;
    status: string;
    topic: string;
    mentor_notes: string;
    price: string;
    rating: number | null;
    feedback: string;
}

export interface Session {
    id: string;
    title: string;
    menteeName: string;
    menteeInitials: string;
    menteeImage: string | null;
    date: string;
    time: string;
    duration: string;
    rating: number;
    price: number;
    status: 'completed' | 'upcoming' | 'cancelled';
    topic: string;
    feedback: string;
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
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTime = (dateString: string, durationMinutes: number): { time: string; duration: string } => {
    const start = new Date(dateString);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const startTime = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const endTime = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationStr = hours > 0 ? (mins > 0 ? `${hours}h${mins}m` : `${hours}h`) : `${mins}m`;

    return {
        time: `${startTime} - ${endTime}`,
        duration: durationStr
    };
};

const mapBackendToSession = (backendSession: BackendSession): Session => {
    const { time, duration } = formatTime(backendSession.scheduled_at, backendSession.duration_minutes);

    // Map backend status to frontend status
    let status: 'completed' | 'upcoming' | 'cancelled' = 'upcoming';
    if (backendSession.status === 'completed') status = 'completed';
    else if (backendSession.status === 'cancelled') status = 'cancelled';
    else if (['pending', 'confirmed', 'in_progress'].includes(backendSession.status)) status = 'upcoming';

    return {
        id: backendSession.id,
        title: backendSession.session_type_name || 'Mentoring Session',
        menteeName: backendSession.mentee.full_name,
        menteeInitials: getInitials(backendSession.mentee.full_name),
        menteeImage: backendSession.mentee.profile_picture_url || backendSession.mentee.social_picture_url || null,
        date: formatDate(backendSession.scheduled_at),
        time,
        duration,
        rating: backendSession.rating ?? 0,
        price: parseFloat(backendSession.price) || 0,
        status,
        topic: backendSession.topic || '',
        feedback: backendSession.feedback || ''
    };
};

export const SessionsList: FunctionComponent = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get('/scheduling/sessions/');
                const mappedSessions = response.data.map(mapBackendToSession);
                setSessions(mappedSessions);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10" />
                            <div className="flex-1 space-y-2">
                                <div className="h-6 bg-white/10 rounded w-48" />
                                <div className="h-4 bg-white/10 rounded w-32" />
                                <div className="h-4 bg-white/10 rounded w-64" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-8 bg-white/10 rounded w-16" />
                                <div className="h-8 bg-white/10 rounded w-16" />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-full" />
                            <div className="h-20 bg-white/10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#A684FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Sessions Yet</h3>
                <p className="text-white/60 text-sm">Your sessions will appear here once they are booked.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    );
};
