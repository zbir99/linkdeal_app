import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Mentor {
  id: number;
  initials: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  languages: ('french' | 'english')[];
  skills: string[];
}

interface MentorListProps {
  searchTerm: string;
  selectedCategory: string;
  onClearSearch: () => void;
}

const MentorList: FunctionComponent<MentorListProps> = ({ searchTerm, selectedCategory, onClearSearch }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 6;
  
  const allMentors: Mentor[] = [
    {
      id: 1,
      initials: 'MD',
      name: 'Marie Dupont',
      title: 'Senior Full-Stack Developer',
      location: 'Paris, France',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 80,
      languages: ['french', 'english'],
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      initials: 'AM',
      name: 'Alexandre Martin',
      title: 'UX/UI Designer',
      location: 'Lyon, France',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 65,
      languages: ['french'],
      skills: ['Figma', 'User Research', 'Design Systems']
    },
    {
      id: 3,
      initials: 'SB',
      name: 'Sophie Bernard',
      title: 'Data Scientist',
      location: 'Toulouse, France',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 95,
      languages: ['french', 'english'],
      skills: ['Python', 'Machine Learning', 'TensorFlow']
    },
    {
      id: 4,
      initials: 'TD',
      name: 'Thomas Dubois',
      title: 'DevOps Engineer',
      location: 'Marseille, France',
      rating: 4.7,
      reviews: 73,
      hourlyRate: 75,
      languages: ['french', 'english'],
      skills: ['Docker', 'Kubernetes', 'AWS']
    },
    {
      id: 5,
      initials: 'JP',
      name: 'Julie Petit',
      title: 'Mobile Developer',
      location: 'Nice, France',
      rating: 4.9,
      reviews: 92,
      hourlyRate: 70,
      languages: ['french'],
      skills: ['React Native', 'iOS', 'Android']
    },
    {
      id: 6,
      initials: 'LM',
      name: 'Lucas Moreau',
      title: 'Product Manager',
      location: 'Bordeaux, France',
      rating: 4.8,
      reviews: 64,
      hourlyRate: 85,
      languages: ['french', 'english'],
      skills: ['Product Strategy', 'Agile', 'User Stories']
    }
  ];

  // Filter mentors based on search term and category
  const filteredMentors = allMentors.filter(mentor => {
    const matchesSearch = searchTerm === '' || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      mentor.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const startIndex = (currentPage - 1) * mentorsPerPage;
  const endIndex = startIndex + mentorsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProfile = (mentorId: number) => {
    console.log('Viewing profile for mentor:', mentorId);
    navigate('/mentee/description');
  };

  return (
    <div>
      {filteredMentors.length === 0 ? (
        // No mentors found state
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
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
                <div className="w-14 h-14 rounded-full bg-[#7008E7] flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-[#7008E7]/50">
                  <span className="text-white text-lg font-semibold">{mentor.initials}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-inter leading-7">{mentor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {mentor.languages.map((language, index) => (
                      <div key={index} className="w-6 h-6 rounded-full overflow-hidden border border-white/20 hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-lg flex items-center justify-center">
                        {language === 'french' ? (
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect width="8" height="24" fill="#002395"/>
                            <rect x="8" width="8" height="24" fill="#FFFFFF"/>
                            <rect x="16" width="8" height="24" fill="#ED2939"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect width="24" height="24" fill="#012169"/>
                            <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="2.4"/>
                            <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.6" clipPath="url(#clip)"/>
                            <clipPath id="clip">
                              <path d="M12 12 L0 0 L0 12 L12 12 L12 0 Z M12 12 L24 24 L24 12 L12 12 L12 24 Z"/>
                            </clipPath>
                            <path d="M12 0 L12 24 M0 12 L24 12" stroke="#FFFFFF" strokeWidth="4"/>
                            <path d="M12 0 L12 24 M0 12 L24 12" stroke="#C8102E" strokeWidth="2.4"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-300 text-sm font-arimo">{mentor.title}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.84285 5.32387 5.34315 3.58579C6.84344 1.84771 9.31313 1 12 1C14.6869 1 17.1566 1.84771 18.6569 3.58579C20.1571 5.32387 21 7.61305 21 10Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-400 text-sm font-arimo">{mentor.location}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white text-base font-inter">{mentor.rating}</span>
                </div>
                <span className="text-gray-400 text-sm font-arimo">({mentor.reviews} reviews)</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-xs text-gray-300 font-arimo transition-all duration-300 hover:bg-[#7008E7]/20 hover:border-[#7008E7]/40 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#7008E7]/20 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-10">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white text-base font-inter">€{mentor.hourlyRate}/hour</span>
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
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === page
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
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
