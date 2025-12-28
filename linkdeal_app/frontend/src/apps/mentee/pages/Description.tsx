import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';
import BackButton from '../components/description/BackButton.tsx';
import MentorProfile from '../components/description/MentorProfile.tsx';
import BookingCard from '../components/description/BookingCard.tsx';

interface MentorData {
  id: string;
  full_name: string;
  professional_title: string;
  profile_picture_url: string | null;
  social_picture_url: string | null;
  bio: string;
  skills: string[];
  languages: string[];
  location: string;
  country: string;
  linkedin_url: string;
  cv_url: string | null;
  average_rating: number | null;
  reviews_count: number;
  session_rate: number | null;
  categories: { id: string; name: string; slug: string; is_primary: boolean }[];
  is_favorite: boolean;
  recent_reviews?: {
    id: string;
    rating: number;
    comment: string;
    mentee: { full_name: string };
    created_at: string;
  }[];
}

const Description: FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/mentee/find-mentor');
  };

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      if (!id) {
        setError('Mentor ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`mentoring/mentors/${id}/`);
        setMentor(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mentor:', err);
        setError('Failed to load mentor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  // Helper to get initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format reviews for the mentor profile component
  const formatReviews = (reviews?: MentorData['recent_reviews']) => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.map(review => ({
      rating: review.rating,
      comment: review.comment || 'Great mentor!',
      author: review.mentee?.full_name || 'Anonymous',
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/70">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl text-white font-semibold">Error Loading Profile</h2>
          <p className="text-white/60">{error || 'Mentor not found'}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-3 rounded-lg bg-[#7008E7] text-white hover:bg-[#5a07b8] transition-all"
          >
            Back to Find Mentor
          </button>
        </div>
      </div>
    );
  }

  // Prepare mentor data for the profile component
  const mentorData = {
    name: mentor.full_name || 'Unknown',
    title: mentor.professional_title || 'Mentor',
    initials: getInitials(mentor.full_name),
    profilePicture: mentor.profile_picture_url || mentor.social_picture_url || null,
    rating: mentor.average_rating ?? 0,
    reviews: mentor.reviews_count ?? 0,
    bio: mentor.bio || 'No bio available.',
    skills: mentor.skills || [],
    languages: mentor.languages || [],
    location: mentor.location || mentor.country || 'Unknown',
    linkedin_url: mentor.linkedin_url || null,
    cv_url: mentor.cv_url || null,
    reviewList: formatReviews(mentor.recent_reviews)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects - Desktop */}
      <div className="hidden lg:block">
        <div className="fixed top-[92px] left-[831.4px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[428px] left-[179px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[428px] left-[977px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Background Blur Effects - Mobile */}
      <div className="lg:hidden">
        <div className="absolute top-[428px] left-[179px] [filter:blur(96px)] rounded-full w-72 h-72 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
        <div className="absolute top-[428px] right-[40px] [filter:blur(96px)] rounded-full w-64 h-64 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Back Button */}
          <div className="mb-6 lg:mb-0 flex justify-start lg:justify-start lg:absolute lg:top-8 lg:left-6">
            <BackButton onBack={handleBack} />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 pt-6 lg:pt-20">
            {/* Left Column - Mentor Details */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <MentorProfile {...mentorData} />
            </div>

            {/* Right Column - Booking Card */}
            <div className="w-full lg:w-[304px] flex justify-center lg:block">
              <div className="w-full max-w-[360px] lg:max-w-none lg:sticky lg:top-24">
                <BookingCard
                  price={mentor.session_rate ?? 0}
                  duration="60 minutes"
                  mentorId={id || ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;