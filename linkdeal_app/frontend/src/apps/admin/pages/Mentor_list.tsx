import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import {
  MentorListHeader,
  SearchBar,
  MentorList,
  Mentor,
} from '../components/mentor_list';

const MentorListPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  // Use useEffect to fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        // Use full path or import api client correctly
        // Assuming api.get handles the baseURL
        const response = await api.get('/auth/admin/mentors/pending/');

        // Map backend response to Mentor interface
        const mappedMentors = response.data.results ? response.data.results.map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          domain: m.professional_title || 'N/A',
          submittedDate: new Date(m.created_at).toLocaleDateString(),
          profilePictureUrl: m.profile_picture_url,
          socialPictureUrl: m.social_picture_url
        })) : response.data.map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          domain: m.professional_title || 'N/A',
          submittedDate: new Date(m.created_at).toLocaleDateString(),
          profilePictureUrl: m.profile_picture_url,
          socialPictureUrl: m.social_picture_url
        }));
        setMentors(mappedMentors);
      } catch (error) {
        console.error("Failed to fetch pending mentors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []); // Run once on mount

  // Filter mentors based on search query
  const filteredMentors = mentors.filter((mentor) => {
    const query = searchQuery.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(query) ||
      mentor.email.toLowerCase().includes(query) ||
      mentor.domain.toLowerCase().includes(query)
    );
  });

  const handleReview = (mentorId: string) => {
    // Navigate to dynamic validation page
    navigate(`/admin/mentors/${mentorId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative">
      {/* Background Blur Effects - Fixed to viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed top-[428px] left-[-46px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />
      <div className="fixed top-[751px] left-[164px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7008E7] border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <MentorListHeader
                pendingCount={mentors.length}
              />

              {/* Search Bar */}
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              {/* Mentor List */}
              <MentorList mentors={filteredMentors} onReview={handleReview} onClearSearch={handleClearSearch} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorListPage;

