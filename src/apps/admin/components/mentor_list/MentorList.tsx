import { FunctionComponent } from 'react';
import MentorCard from './MentorCard';
import { Mentor } from './types';

interface MentorListProps {
  mentors: Mentor[];
  onReview?: (mentorId: string) => void;
  onClearSearch?: () => void;
}

const MentorList: FunctionComponent<MentorListProps> = ({ mentors, onReview, onClearSearch }) => {
  if (mentors.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-12 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/10 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#A684FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No mentors found</h3>
        <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
          No mentors match your search query. Try adjusting your filters or search terms to find what you're looking for.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:border-white/30"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} onReview={onReview} />
      ))}
    </div>
  );
};

export default MentorList;

