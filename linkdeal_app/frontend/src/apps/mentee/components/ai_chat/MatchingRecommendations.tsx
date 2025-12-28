import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface RecommendedMentor {
    id: string;
    name: string;
    title: string;
    bio: string;
    skills: string[];
    languages: string[];
    session_rate: number;
    profile_picture_url?: string;
    match_reason: string;
    rating?: number;
    sessions_count?: number;
    similarity_score?: number;
    confidence?: 'very_high' | 'high' | 'medium' | 'low';
    explanation?: string;
}

interface UserProfile {
    name: string;
    role: string;
    interests: string[];
    profile_picture?: string;
}


interface MatchingRecommendationsProps {
    mentors: RecommendedMentor[];
    userProfile?: UserProfile;
    extractedProfile?: {
        desired_skills?: string[];
        goals?: string;
        experience_level?: string;
    };
    isVisible: boolean;
    isMobileOpen?: boolean;
    onClose?: () => void;
}

const MatchingRecommendations: FunctionComponent<MatchingRecommendationsProps> = ({
    mentors,
    userProfile,
    extractedProfile,
    isVisible,
    isMobileOpen = false,
    onClose
}) => {
    const navigate = useNavigate();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleBookSession = (mentorId: string) => {
        navigate(`/mentee/booking/${mentorId}`);
    };

    if (!isVisible && !isMobileOpen) return null;

    // Get interests from extracted profile - no fake defaults
    const interests = extractedProfile?.desired_skills || userProfile?.interests || [];
    const userName = userProfile?.name || 'You';
    const userRole = userProfile?.role || (extractedProfile?.experience_level ? `${extractedProfile.experience_level} Level` : '');

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                ${isMobileOpen
                    ? 'fixed right-0 top-0 h-full z-50 w-[85%] max-w-[420px] transform transition-transform duration-300 translate-x-0'
                    : 'hidden lg:block w-[420px]'
                }
                h-full bg-[#0d0d1a] border-l border-white/10 overflow-y-auto flex-shrink-0
            `}>
                {/* Mobile Header with Close Button */}
                {isMobileOpen && (
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="text-white font-bold text-lg">Recommended Mentors</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-6 space-y-6">

                    {/* User Profile Card */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                        <div className="flex items-center gap-4 mb-4">
                            {userProfile?.profile_picture ? (
                                <img
                                    src={userProfile.profile_picture}
                                    alt={userName}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A684FF] to-[#7008E7] flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">{userName.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                            <div>
                                <h3 className="text-white font-bold text-lg">{userName}</h3>
                                {userRole && <p className="text-gray-400 text-sm">{userRole}</p>}
                            </div>
                        </div>

                        <div>
                            <p className="text-white text-sm font-semibold mb-2">Your Interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {interests.length > 0 ? (
                                    interests.slice(0, 4).map((interest, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg bg-[#7008E7]/20 border border-[#7008E7]/40 text-[#A684FF] text-xs"
                                        >
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-xs italic">No interests specified yet</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recommended Mentors Section */}
                    {mentors.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-white font-bold text-lg">Recommended Mentors</h2>

                            {mentors.map((mentor) => (
                                <div
                                    key={mentor.id}
                                    className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 hover:bg-white/10 hover:border-[#7008E7]/30 transition-all duration-300"
                                >
                                    {/* Mentor Header */}
                                    <div className="flex items-start gap-3">
                                        {mentor.profile_picture_url ? (
                                            <img
                                                src={mentor.profile_picture_url}
                                                alt={mentor.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A684FF] to-[#7008E7] flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-sm">{getInitials(mentor.name)}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-bold text-base">{mentor.name}</h3>
                                                {mentor.confidence && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${mentor.confidence === 'very_high' ? 'bg-green-500/20 text-green-400' :
                                                        mentor.confidence === 'high' ? 'bg-blue-500/20 text-blue-400' :
                                                            mentor.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {mentor.confidence.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#A684FF] text-sm">{mentor.title}</p>
                                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{mentor.bio}</p>
                                        </div>
                                    </div>

                                    {/* Similarity Score Bar */}
                                    {mentor.similarity_score !== undefined && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-400">Match Score</span>
                                                <span className="text-white font-medium">{Math.round(mentor.similarity_score * 100)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#7008E7] to-[#A684FF] rounded-full transition-all duration-500"
                                                    style={{ width: `${mentor.similarity_score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Rating & Sessions - default to 0 if no data */}
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-white">{(mentor.rating ?? 0).toFixed(1)}</span>
                                        </div>
                                        <span className="text-gray-400">
                                            {mentor.sessions_count ?? 0} sessions completed
                                        </span>
                                    </div>

                                    {/* Explanation Quote */}
                                    <div className="rounded-xl bg-[#1a1a2e] p-3">
                                        <p className="text-gray-400 text-xs italic leading-relaxed">
                                            "{mentor.explanation || mentor.match_reason}"
                                        </p>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => handleBookSession(mentor.id)}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        Book Session with {mentor.name.split(' ')[0]}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {mentors.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#7008E7]/20 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" stroke="#A684FF" strokeWidth="2" />
                                    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-2">No Recommendations Yet</h3>
                            <p className="text-gray-400 text-sm">
                                Chat with the AI coach to get personalized mentor recommendations!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MatchingRecommendations;
