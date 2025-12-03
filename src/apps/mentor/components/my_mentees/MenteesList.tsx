import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Mentee {
  id: string;
  name: string;
  initials: string;
  sessions: number;
  totalHours: number;
  lastSession: string;
  rating: number;
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
  const mentees: Mentee[] = [
    {
      id: '1',
      name: 'John Doe',
      initials: 'JD',
      sessions: 8,
      totalHours: 8,
      lastSession: '2 days ago',
      rating: 5.0
    },
    {
      id: '2',
      name: 'Sarah Smith',
      initials: 'SS',
      sessions: 12,
      totalHours: 12,
      lastSession: '1 week ago',
      rating: 5.0
    },
    {
      id: '3',
      name: 'Mike Johnson',
      initials: 'MJ',
      sessions: 5,
      totalHours: 5,
      lastSession: '3 weeks ago',
      rating: 4.0
    },
    {
      id: '4',
      name: 'Alice Brown',
      initials: 'AB',
      sessions: 15,
      totalHours: 15,
      lastSession: 'Yesterday',
      rating: 5.0
    },
    {
      id: '5',
      name: 'Bob Wilson',
      initials: 'BW',
      sessions: 3,
      totalHours: 3,
      lastSession: '1 month ago',
      rating: 4.0
    }
  ];

  // Filter mentees based on search criteria
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(normalizedSearch);
    return matchesSearch;
  });

  // Sort mentees based on sort criteria
  const normalizedSort = sortBy.trim().toLowerCase();

  const sortedMentees = [...filteredMentees].sort((a, b) => {
    switch (normalizedSort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'sessions':
        return b.sessions - a.sessions;
      case 'last session':
        return 0; // Would need proper date comparison in real app
      default:
        return 0;
    }
  });

  const handleMenteeClick = (mentee: Mentee) => {
    navigate('/mentor/history-mentee', { state: { mentee } });
  };

  const MenteeCard: FunctionComponent<{ mentee: Mentee }> = ({ mentee }) => (
    <div 
      onClick={() => handleMenteeClick(mentee)}
      className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 hover:bg-white/10 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-300 transform group cursor-pointer"
    >
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Section: Avatar and Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#7008E7] flex items-center justify-center group-hover:bg-[#8B5CF6] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
            <span className="text-white text-sm sm:text-base md:text-lg font-semibold">{mentee.initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-1 group-hover:text-purple-200 transition-colors duration-300 truncate">{mentee.name}</h3>
            <div className="text-white/60 text-xs sm:text-sm flex flex-wrap gap-x-2 gap-y-1">
              <span className="whitespace-nowrap">{mentee.sessions} sessions • {mentee.totalHours}h total</span>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">Last: {mentee.lastSession}</span>
            </div>
          </div>
        </div>
        
        {/* Right Section: Rating, Status, and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Rating and Status Row */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              <span className="text-white text-xs sm:text-sm group-hover:text-purple-200 transition-colors duration-300">{mentee.rating.toFixed(1)}</span>
            </div>
            
            <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap bg-green-500/20 border border-green-500/30 text-green-300 group-hover:bg-green-500/30 group-hover:border-green-400/40 group-hover:text-green-200">
              Active
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle schedule action here
              }}
              className="flex-1 sm:flex-none px-3 py-2 bg-[#7008E7] rounded-lg text-white text-xs sm:text-sm hover:bg-[#8B5CF6] hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 sm:w-4 sm:h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NoResultsState: FunctionComponent = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sm:p-10 md:p-12 text-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-white text-base sm:text-lg font-semibold mb-2">No mentees found</h3>
      <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto">
        {searchTerm 
          ? `No mentees match your search for "${searchTerm}"`
          : 'No mentees match your current filters'
        }
      </p>
      <button 
        onClick={onClearFilters}
        className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#7008E7] rounded-lg text-white text-xs sm:text-sm hover:bg-[#8B5CF6] hover:scale-105 transition-all duration-200 active:scale-95"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {sortedMentees.length > 0 ? (
        sortedMentees.map((mentee) => (
          <MenteeCard key={mentee.id} mentee={mentee} />
        ))
      ) : (
        <NoResultsState />
      )}
    </div>
  );
};
