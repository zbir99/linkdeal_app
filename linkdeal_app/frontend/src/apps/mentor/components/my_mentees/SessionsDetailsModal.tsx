import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';

interface Session {
    id: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    session_type?: {
        name: string;
    };
    notes?: string;
}

interface SessionsDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    menteeId: string;
    menteeName: string;
}

export const SessionsDetailsModal: FunctionComponent<SessionsDetailsModalProps> = ({
    isOpen,
    onClose,
    menteeId,
    menteeName
}) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && menteeId) {
            fetchSessions();
        }
    }, [isOpen, menteeId]);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Fetch upcoming sessions (pending and confirmed) for this mentee
            const response = await api.get('/scheduling/sessions/', {
                params: {
                    mentee_id: menteeId,
                    status: 'upcoming'
                }
            });

            // Sort sessions by scheduled_at (closest first)
            const sortedSessions = (response.data.results || response.data || []).sort(
                (a: Session, b: Session) =>
                    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
            );

            setSessions(sortedSessions);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
            setError('Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeUntil = (dateString: string) => {
        const now = new Date();
        const sessionDate = new Date(dateString);
        const diffMs = sessionDate.getTime() - now.getTime();

        if (diffMs < 0) return 'Started';

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) {
            return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
        if (diffHours > 0) {
            return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        }
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/20 border-green-500/30 text-green-300';
            case 'pending':
                return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
            default:
                return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
        }
    };

    if (!isOpen) return null;

    const nextSession = sessions[0];
    const otherSessions = sessions.slice(1);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-[#1a1a2e]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Sessions with {menteeName}</h2>
                            <p className="text-white/60 text-sm mt-1">
                                {sessions.length} upcoming session{sessions.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                                    <div className="h-5 bg-white/10 rounded w-32 mb-2" />
                                    <div className="h-4 bg-white/10 rounded w-48" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={fetchSessions}
                                className="mt-4 px-4 py-2 bg-[#7008E7] rounded-lg text-white text-sm hover:bg-[#8B5CF6] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="text-lg text-white font-medium mb-2">No Upcoming Sessions</h3>
                            <p className="text-white/60 text-sm">There are no scheduled sessions with this mentee.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Next Session - Featured */}
                            {nextSession && (
                                <div className="bg-gradient-to-r from-[#7008E7]/20 to-purple-600/10 border border-[#7008E7]/30 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2.5 py-1 bg-[#7008E7] rounded-full text-xs font-medium text-white">
                                            Next Session
                                        </span>
                                        <span className="text-purple-300 text-xs font-medium">
                                            {getTimeUntil(nextSession.scheduled_at)}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">
                                        {formatDate(nextSession.scheduled_at)}
                                    </h3>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <div className="flex items-center gap-1.5 text-white/70">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {formatTime(nextSession.scheduled_at)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/70">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {nextSession.duration_minutes} min
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(nextSession.status)}`}>
                                            {nextSession.status.charAt(0).toUpperCase() + nextSession.status.slice(1)}
                                        </span>
                                    </div>
                                    {nextSession.session_type?.name && (
                                        <p className="text-white/50 text-sm mt-2">
                                            {nextSession.session_type.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Other Upcoming Sessions */}
                            {otherSessions.length > 0 && (
                                <>
                                    <h4 className="text-white/60 text-sm font-medium mt-6 mb-3">Other Upcoming Sessions</h4>
                                    <div className="space-y-3">
                                        {otherSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-white font-medium text-sm">
                                                        {formatDate(session.scheduled_at)}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(session.status)}`}>
                                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3 text-xs text-white/60">
                                                    <span>{formatTime(session.scheduled_at)}</span>
                                                    <span>•</span>
                                                    <span>{session.duration_minutes} min</span>
                                                    {session.session_type?.name && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{session.session_type.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionsDetailsModal;
