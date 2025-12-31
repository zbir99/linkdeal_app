import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface Mentor {
  id: string;
  full_name: string;
  professional_title: string;
  location: string;
  country: string;
  profile_picture_url: string | null;
  social_picture_url: string | null;
  bio: string;
  skills: string[];
  languages: string[];
  average_rating: number | null;
  reviews_count: number;
  session_rate: number | null;
  categories: { id: string; name: string; slug: string; is_primary: boolean }[];
  is_favorite: boolean;
}

interface MentorListProps {
  searchTerm: string;
  selectedCategory: string;
  onClearSearch: () => void;
}

const MentorList: FunctionComponent<MentorListProps> = ({ searchTerm, selectedCategory, onClearSearch }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mentorsPerPage = 6;

  // Category to Professional Titles mapping
  const categoryTitlesMap: { [key: string]: string[] } = {
    'Development': [
      'Full-Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'Mobile Developer',
      'Software Architect',
      'Blockchain Developer',
      'Game Developer',
      'Embedded Systems Engineer'
    ],
    'Design': [
      'UX/UI Designer',
      'Product Designer'
    ],
    'Data Science': [
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Engineer',
      'Data Analyst'
    ],
    'DevOps': [
      'DevOps Engineer',
      'Cloud Architect',
      'Solutions Architect',
      'Cybersecurity Specialist',
      'QA Engineer'
    ],
    'Product Management': [
      'Product Manager',
      'Project Manager',
      'Engineering Manager',
      'Tech Lead',
      'CTO',
      'Startup Founder',
      'Business Analyst'
    ],
    'Marketing': [
      'Technical Writer'
    ],
    'Other': [
      'Other'
    ]
  };

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        const url = `mentoring/mentors/${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await api.get(url);
        setMentors(response.data || []);
      } catch (err) {
        console.error('Failed to fetch mentors:', err);
        setError('Failed to load mentors');
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [searchTerm]);

  // Filter mentors by category (professional title)
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All Categories') {
      const titlesForCategory = categoryTitlesMap[selectedCategory] || [];
      const filtered = mentors.filter(mentor =>
        titlesForCategory.some(title =>
          mentor.professional_title?.toLowerCase().includes(title.toLowerCase())
        )
      );
      setFilteredMentors(filtered);
    } else {
      setFilteredMentors(mentors);
    }
    setCurrentPage(1);
  }, [mentors, selectedCategory]);

  // Helper function to get initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to display language flags
  const getLanguageFlag = (language: string) => {
    const lang = language.toLowerCase();

    // French
    if (lang.includes('french') || lang.includes('français')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="8" height="24" fill="#002395" />
          <rect x="8" width="8" height="24" fill="#FFFFFF" />
          <rect x="16" width="8" height="24" fill="#ED2939" />
        </svg>
      );
    }

    // English (UK)
    if (lang.includes('english') || lang.includes('anglais')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="2.4" />
          <path d="M12 0 L12 24 M0 12 L24 12" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M12 0 L12 24 M0 12 L24 12" stroke="#C8102E" strokeWidth="2.4" />
        </svg>
      );
    }

    // Spanish
    if (lang.includes('spanish') || lang.includes('español') || lang.includes('espagnol')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="6" fill="#AA151B" />
          <rect y="6" width="24" height="12" fill="#F1BF00" />
          <rect y="18" width="24" height="6" fill="#AA151B" />
        </svg>
      );
    }

    // German
    if (lang.includes('german') || lang.includes('deutsch') || lang.includes('allemand')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="8" fill="#000000" />
          <rect y="8" width="24" height="8" fill="#DD0000" />
          <rect y="16" width="24" height="8" fill="#FFCE00" />
        </svg>
      );
    }

    // Arabic
    if (lang.includes('arabic') || lang.includes('عربي') || lang.includes('arabe')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="8" fill="#007A3D" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#000000" />
          <polygon points="0,0 8,12 0,24" fill="#CE1126" />
        </svg>
      );
    }

    // Italian
    if (lang.includes('italian') || lang.includes('italiano') || lang.includes('italien')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="8" height="24" fill="#009246" />
          <rect x="8" width="8" height="24" fill="#FFFFFF" />
          <rect x="16" width="8" height="24" fill="#CE2B37" />
        </svg>
      );
    }

    // Portuguese
    if (lang.includes('portuguese') || lang.includes('português') || lang.includes('portugais')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="9" height="24" fill="#006600" />
          <rect x="9" width="15" height="24" fill="#FF0000" />
          <circle cx="9" cy="12" r="4" fill="#FFCC00" />
        </svg>
      );
    }

    // Chinese (Mandarin)
    if (lang.includes('chinese') || lang.includes('mandarin') || lang.includes('中文') || lang.includes('chinois')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#DE2910" />
          <polygon points="5,3 6,6 4,6" fill="#FFDE00" />
          <polygon points="8,2 9,4 7,4" fill="#FFDE00" />
          <polygon points="10,4 11,6 9,6" fill="#FFDE00" />
          <polygon points="10,7 11,9 9,9" fill="#FFDE00" />
          <polygon points="8,9 9,11 7,11" fill="#FFDE00" />
        </svg>
      );
    }

    // Japanese
    if (lang.includes('japanese') || lang.includes('日本語') || lang.includes('japonais')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="6" fill="#BC002D" />
        </svg>
      );
    }

    // Korean
    if (lang.includes('korean') || lang.includes('한국어') || lang.includes('coréen')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="5" fill="#C60C30" />
          <path d="M12 7 Q17 12 12 17" fill="#003478" />
        </svg>
      );
    }

    // Russian
    if (lang.includes('russian') || lang.includes('русский') || lang.includes('russe')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="8" fill="#FFFFFF" />
          <rect y="8" width="24" height="8" fill="#0039A6" />
          <rect y="16" width="24" height="8" fill="#D52B1E" />
        </svg>
      );
    }

    // Dutch
    if (lang.includes('dutch') || lang.includes('nederlands') || lang.includes('néerlandais')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="8" fill="#AE1C28" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#21468B" />
        </svg>
      );
    }

    // Hindi
    if (lang.includes('hindi') || lang.includes('हिंदी')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="2.5" fill="#000080" stroke="#000080" strokeWidth="0.5" />
        </svg>
      );
    }

    // Turkish
    if (lang.includes('turkish') || lang.includes('türkçe') || lang.includes('turc')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#E30A17" />
          <circle cx="10" cy="12" r="5" fill="#FFFFFF" />
          <circle cx="11.5" cy="12" r="4" fill="#E30A17" />
          <polygon points="15,12 17,10.5 16,12 17,13.5" fill="#FFFFFF" />
        </svg>
      );
    }

    // Polish
    if (lang.includes('polish') || lang.includes('polski') || lang.includes('polonais')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="12" fill="#FFFFFF" />
          <rect y="12" width="24" height="12" fill="#DC143C" />
        </svg>
      );
    }

    // Greek
    if (lang.includes('greek') || lang.includes('ελληνικά') || lang.includes('grec')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#0D5EAF" />
          <rect y="0" width="24" height="2.67" fill="#FFFFFF" />
          <rect y="5.33" width="24" height="2.67" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="2.67" fill="#FFFFFF" />
          <rect y="16" width="24" height="2.67" fill="#FFFFFF" />
          <rect y="21.33" width="24" height="2.67" fill="#FFFFFF" />
        </svg>
      );
    }

    // Swedish
    if (lang.includes('swedish') || lang.includes('svenska') || lang.includes('suédois')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#006AA7" />
          <rect x="7" width="4" height="24" fill="#FECC00" />
          <rect y="10" width="24" height="4" fill="#FECC00" />
        </svg>
      );
    }

    // Norwegian
    if (lang.includes('norwegian') || lang.includes('norsk') || lang.includes('norvégien')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect width="24" height="24" fill="#EF2B2D" />
          <rect x="6" width="6" height="24" fill="#FFFFFF" />
          <rect y="9" width="24" height="6" fill="#FFFFFF" />
          <rect x="7.5" width="3" height="24" fill="#002868" />
          <rect y="10.5" width="24" height="3" fill="#002868" />
        </svg>
      );
    }

    // Default: world/globe icon for unknown languages
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="url(#globeGradient)" />
        <defs>
          <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7008E7" />
            <stop offset="100%" stopColor="#9B4DFF" />
          </linearGradient>
        </defs>
        <ellipse cx="12" cy="12" rx="10" ry="10" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="0.5" />
        <path d="M3.5 7 Q12 5 20.5 7" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        <path d="M3.5 17 Q12 19 20.5 17" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
      </svg>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const startIndex = (currentPage - 1) * mentorsPerPage;
  const endIndex = startIndex + mentorsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProfile = (mentorId: string) => {
    console.log('Viewing profile for mentor:', mentorId);
    navigate(`/mentee/description/${mentorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/70">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-2xl text-white font-inter mb-2">Error Loading Mentors</h3>
        <p className="text-gray-400 text-center font-arimo max-w-md">{error}</p>
        <button
          className="mt-6 px-6 py-3 rounded-lg bg-[#7008E7] text-white font-arimo hover:bg-[#5a07b8] transition-all duration-300"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {filteredMentors.length === 0 ? (
        // No mentors found state
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-2xl text-white font-inter mb-2">No mentors found</h3>
          <p className="text-gray-400 text-center font-arimo max-w-md">
            We couldn't find any mentors matching your search criteria. Try adjusting your search terms or browse all categories.
          </p>
          <button
            className="mt-6 px-6 py-3 rounded-lg bg-[#7008E7] text-white font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50"
            onClick={onClearSearch}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Mentors grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#7008E7]/20"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {(mentor.profile_picture_url || mentor.social_picture_url) ? (
                    <img
                      src={mentor.profile_picture_url || mentor.social_picture_url || ''}
                      alt={mentor.full_name || 'Mentor'}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50"
                      onError={(e) => {
                        // Hide broken image and show initials fallback
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const initialsDiv = document.createElement('div');
                          initialsDiv.className = 'w-14 h-14 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50';
                          initialsDiv.innerHTML = `<span class="text-white text-lg font-semibold">${getInitials(mentor.full_name)}</span>`;
                          parent.insertBefore(initialsDiv, e.currentTarget);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50">
                      <span className="text-white text-lg font-semibold">{getInitials(mentor.full_name)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-inter leading-7">{mentor.full_name || 'Unknown'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {(mentor.languages || []).slice(0, 3).map((language, index) => (
                        <div key={index} className="w-6 h-6 rounded-full overflow-hidden border border-white/20 hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-lg flex items-center justify-center">
                          {getLanguageFlag(language)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-300 text-sm font-arimo">{mentor.professional_title || 'Mentor'}</p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.84285 5.32387 5.34315 3.58579C6.84344 1.84771 9.31313 1 12 1C14.6869 1 17.1566 1.84771 18.6569 3.58579C20.1571 5.32387 21 7.61305 21 10Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-400 text-sm font-arimo">{mentor.location || mentor.country || 'Unknown location'}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white text-base font-inter">{mentor.average_rating ?? 0}</span>
                  </div>
                  <span className="text-gray-400 text-sm font-arimo">({mentor.reviews_count ?? 0} reviews)</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(mentor.skills || []).slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-xs text-gray-300 font-arimo transition-all duration-300 hover:bg-[#7008E7]/20 hover:border-[#7008E7]/40 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#7008E7]/20 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                  {(mentor.skills || []).length > 3 && (
                    <span className="px-3 py-1 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-xs text-gray-400 font-arimo">
                      +{mentor.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-10">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white text-base font-inter">${mentor.session_rate ?? 0}/hour</span>
                    {mentor.is_favorite && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewProfile(mentor.id)}
                    className="px-4 py-2 rounded-lg bg-[#7008E7] text-white text-sm font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === page
                    ? 'bg-[#7008E7] border-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MentorList;
