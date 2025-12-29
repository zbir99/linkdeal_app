import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { SessionsDetailsModal } from './SessionsDetailsModal';

interface MenteeData {
  id: string;
  full_name: string;
  email: string;
  profile_picture_url: string | null;
  social_picture_url: string | null;
  field_of_study: string;
  country: string;
}

interface SessionCounts {
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

interface Mentee {
  id: string;
  mentee: MenteeData;
  status: string;
  total_sessions: number;
  completed_sessions: number;
  total_hours: number;
  last_session_at: string | null;
  started_at: string;
  average_rating: number | null;
  session_counts?: SessionCounts;
}

interface MenteesListProps {
  searchTerm?: string;
  filterStatus?: string;
  sortBy?: string;
  onClearFilters?: () => void;
}

export const MenteesList: FunctionComponent<MenteesListProps> = ({
  searchTerm = '',
  filterStatus = '',
  sortBy = '',
  onClearFilters
}) => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentee, setSelectedMentee] = useState<{ id: string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        if (filterStatus) params.status = filterStatus;

        const response = await api.get('/mentoring/mentor/mentees/', { params });
        setMentees(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mentees:', err);
        setError('Failed to load mentees');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentees();
  }, [searchTerm, filterStatus]);

  // Sort mentees based on sort criteria
  const sortedMentees = [...mentees].sort((a, b) => {
    switch (sortBy.toLowerCase()) {
      case 'name':
        return a.mentee.full_name.localeCompare(b.mentee.full_name);
      case 'sessions':
        return b.total_sessions - a.total_sessions;
      case 'last session':
        if (!a.last_session_at) return 1;
        if (!b.last_session_at) return -1;
        return new Date(b.last_session_at).getTime() - new Date(a.last_session_at).getTime();
      default:
        return 0;
    }
  });

  const handleMenteeClick = (mentee: Mentee) => {
    navigate('/mentor/history-mentee', {
      state: {
        mentee: {
          id: mentee.mentee.id,
          name: mentee.mentee.full_name,
          email: mentee.mentee.email,
          initials: getInitials(mentee.mentee.full_name),
          sessions: mentee.total_sessions,
          totalHours: mentee.total_hours,
          completedSessions: mentee.completed_sessions,
          rating: mentee.average_rating,
          lastSession: formatLastSession(mentee.last_session_at),
          profilePicture: mentee.mentee.profile_picture_url || mentee.mentee.social_picture_url,
          fieldOfStudy: mentee.mentee.field_of_study,
          country: mentee.mentee.country,
          startedAt: mentee.started_at,
          status: mentee.status
        }
      }
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastSession = (date: string | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const sessionDate = new Date(date);
    const diffMs = now.getTime() - sessionDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 border-green-500/30 text-green-300 group-hover:bg-green-500/30 group-hover:border-green-400/40';
      case 'paused':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 group-hover:bg-yellow-500/30 group-hover:border-yellow-400/40';
      case 'ended':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300 group-hover:bg-gray-500/30 group-hover:border-gray-400/40';
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
    }
  };

  const MenteeCard: FunctionComponent<{ mentee: Mentee }> = ({ mentee }) => {
    const counts = mentee.session_counts || {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0,
    };

    const sessionStats = [
      { label: 'Upcom', value: counts.pending + counts.confirmed, color: 'text-yellow-300', bgColor: 'bg-yellow-500/20' },
      { label: 'Prog', value: counts.in_progress, color: 'text-purple-300', bgColor: 'bg-purple-500/20' },
      { label: 'Done', value: counts.completed, color: 'text-green-300', bgColor: 'bg-green-500/20' },
    ];

    // Calculate total sessions from all counts
    const totalSessions = counts.pending + counts.confirmed + counts.in_progress + counts.completed + counts.cancelled + counts.no_show;

    return (
      <div
        onClick={() => handleMenteeClick(mentee)}
        className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 hover:bg-white/10 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-300 transform group cursor-pointer"
      >
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Section: Avatar and Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {(mentee.mentee.profile_picture_url || mentee.mentee.social_picture_url) ? (
                <img
                  src={mentee.mentee.profile_picture_url || mentee.mentee.social_picture_url || ''}
                  alt={mentee.mentee.full_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                />
              ) : (
                <span className="text-white text-sm sm:text-base md:text-lg font-semibold">
                  {getInitials(mentee.mentee.full_name)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-1 group-hover:text-purple-200 transition-colors duration-300 truncate">
                {mentee.mentee.full_name}
              </h3>
              <div className="text-white/60 text-xs sm:text-sm flex flex-wrap gap-x-2 gap-y-1">
                <span className="whitespace-nowrap">{totalSessions} sessions • {mentee.total_hours}h total</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">Last: {formatLastSession(mentee.last_session_at)}</span>
              </div>
            </div>
          </div>

          {/* Right Section: Status and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Rating */}
              <div className="flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                </svg>
                <span className="text-white text-xs sm:text-sm group-hover:text-purple-200 transition-colors duration-300">
                  {mentee.average_rating ? mentee.average_rating.toFixed(1) : '-'}
                </span>
              </div>

              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap border ${getStatusBadge(mentee.status)}`}>
                {mentee.status.charAt(0).toUpperCase() + mentee.status.slice(1)}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMentee({ id: mentee.mentee.id, name: mentee.mentee.full_name });
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none px-3 py-2 bg-[#7008E7] rounded-lg text-white text-xs sm:text-sm hover:bg-[#8B5CF6] hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 sm:w-4 sm:h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Details Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Session Status Breakdown */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {sessionStats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} px-2 py-1 rounded text-center min-w-[45px] sm:min-w-[55px]`}
              >
                <div className={`text-xs sm:text-sm font-semibold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/50 truncate">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LoadingState: FunctionComponent = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10" />
            <div className="flex-1">
              <div className="h-5 bg-white/10 rounded w-32 mb-2" />
              <div className="h-4 bg-white/10 rounded w-48" />
            </div>
            <div className="h-8 bg-white/10 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const NoResultsState: FunctionComponent = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-10 md:p-12 text-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-white text-base sm:text-lg font-semibold mb-2">No mentees found</h3>
      <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto">
        {searchTerm
          ? `No mentees match your search for "${searchTerm}"`
          : 'You don\'t have any mentees yet. They will appear here once they book sessions with you.'
        }
      </p>
      {(searchTerm || filterStatus) && (
        <button
          onClick={onClearFilters}
          className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#7008E7] rounded-lg text-white text-xs sm:text-sm hover:bg-[#8B5CF6] hover:scale-105 transition-all duration-200 active:scale-95"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedMentees.length > 0 ? (
          sortedMentees.map((mentee) => (
            <MenteeCard key={mentee.id} mentee={mentee} />
          ))
        ) : (
          <NoResultsState />
        )}
      </div>

      {/* Sessions Details Modal */}
      {selectedMentee && (
        <SessionsDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMentee(null);
          }}
          menteeId={selectedMentee.id}
          menteeName={selectedMentee.name}
        />
      )}
    </>
  );
};
