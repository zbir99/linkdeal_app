import { FunctionComponent } from 'react';
import { Session } from './SessionsList';

interface SessionCardProps {
    session: Session;
}

export const SessionCard: FunctionComponent<SessionCardProps> = ({ session }) => {
    const getStatusBadge = () => {
        switch (session.status) {
            case 'completed':
                return (
                    <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-xs">
                        Completed
                    </div>
                );
            case 'upcoming':
                return (
                    <div className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs">
                        Upcoming
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                        Cancelled
                    </div>
                );
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:bg-white/10 transition-all duration-300">
            {/* Header Section */}
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {session.menteeImage ? (
                        <img
                            src={session.menteeImage}
                            alt={session.menteeName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-base font-normal">{session.menteeInitials}</span>
                    )}
                </div>

                {/* Session Info */}
                <div className="flex-1 space-y-2">
                    {/* Title and Status */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white text-xl font-normal">{session.title}</h3>
                        {getStatusBadge()}
                    </div>

                    {/* Mentee Name */}
                    <p className="text-white/60 text-sm">with {session.menteeName}</p>

                    {/* Date and Time */}
                    <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
                                <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
                                <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
                            </svg>
                            <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
                                <path d="M12 6v6l4 2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{session.time} ({session.duration})</span>
                        </div>
                    </div>
                </div>

                {/* Rating and Price */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                        </svg>
                        <span className="text-white text-sm">{session.rating.toFixed(1)}</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
                        ${session.price}
                    </div>
                </div>
            </div>

            {/* Topic */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#A684FF]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm">Topic</span>
                </div>
                <p className="text-white text-sm leading-relaxed">{session.topic}</p>
            </div>

            {/* Feedback */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-[#A684FF] text-sm">Feedback</div>
                <p className="text-white/60 text-sm leading-snug">{session.feedback}</p>
            </div>
        </div>
    );
};
