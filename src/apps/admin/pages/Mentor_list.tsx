import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MentorListHeader,
  SearchBar,
  MentorList,
  Mentor,
} from '../components/mentor_list';

const MentorListPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API call
  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Alexandre Dubois',
      email: 'alex.dubois@email.com',
      initials: 'AD',
      domain: 'Web Development',
      yearsExperience: 8,
      submittedDate: '11/20/2024',
      certifications: ['React Expert', 'AWS Certified'],
    },
    {
      id: '2',
      name: 'Camille Laurent',
      email: 'c.laurent@email.com',
      initials: 'CL',
      domain: 'UX/UI Design',
      yearsExperience: 5,
      submittedDate: '11/21/2024',
      certifications: ['Figma Master', 'Google UX'],
    },
    {
      id: '3',
      name: 'Thomas Bernard',
      email: 't.bernard@email.com',
      initials: 'TB',
      domain: 'Data Science',
      yearsExperience: 10,
      submittedDate: '11/15/2024',
      certifications: ['Python Expert', 'TensorFlow Certified'],
    },
  ];

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
    // Handle review action - navigate to validation page
    console.log('Review mentor:', mentorId);
    navigate('/admin/validation');
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
          {/* Header */}
          <MentorListHeader
            pendingCount={mentors.length}
          />

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Mentor List */}
          <MentorList mentors={filteredMentors} onReview={handleReview} onClearSearch={handleClearSearch} />
        </div>
      </div>
    </div>
  );
};

export default MentorListPage;

