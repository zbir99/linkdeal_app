import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mentor } from './types';

interface MentorCardProps {
  mentor: Mentor;
  onReview?: (mentorId: string) => void;
}

const MentorCard: FunctionComponent<MentorCardProps> = ({ mentor, onReview }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    if (onReview) {
      onReview(mentor.id);
    } else {
      navigate('/admin/validation');
    }
  };
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white transition-all duration-300 hover:border-purple-400/50 hover:bg-white/10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#7008E7] flex items-center justify-center text-xl font-semibold text-white">
              {mentor.initials}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{mentor.name}</h3>
              <p className="text-white/60 text-sm">{mentor.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
              {mentor.domain}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-500/30">
              {mentor.yearsExperience} years experience
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 border border-orange-500/30">
              Submitted {mentor.submittedDate}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/60">Certifications</p>
            <div className="flex flex-wrap gap-3">
              {mentor.certifications.map((certification) => (
                <span
                  key={certification}
                  className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-sm text-white/80"
                >
                  {certification}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review button */}
        <button
          onClick={handleReviewClick}
          className="h-10 px-5 rounded-xl bg-[#7008E7] text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all duration-200 hover:shadow-purple-500/50 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.3737 8.23175C1.31814 8.08207 1.31814 7.91743 1.3737 7.76775C1.91483 6.45565 2.83338 5.33378 4.01288 4.54435C5.19239 3.75492 6.57973 3.3335 7.99904 3.3335C9.41834 3.3335 10.8057 3.75492 11.9852 4.54435C13.1647 5.33378 14.0832 6.45565 14.6244 7.76775C14.6799 7.91743 14.6799 8.08207 14.6244 8.23175C14.0832 9.54385 13.1647 10.6657 11.9852 11.4552C10.8057 12.2446 9.41834 12.666 7.99904 12.666C6.57973 12.666 5.19239 12.2446 4.01288 11.4552C2.83338 10.6657 1.91483 9.54385 1.3737 8.23175Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Review
        </button>
      </div>
    </div>
  );
};

export default MentorCard;

