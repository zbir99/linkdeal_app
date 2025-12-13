import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorHeader from '../components/find_mentor/MentorHeader.tsx';
import MentorSearch from '../components/find_mentor/MentorSearch.tsx';
import MentorList from '../components/find_mentor/MentorList.tsx';

const FindMentor: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleBack = () => {
    navigate('/mentee/dashboard');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects - Desktop */}
      <div className="hidden lg:block">
        <div className="fixed top-[-110px] left-[-24px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[985px] left-[25px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[280px] left-[259px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Background Blur Effects - Mobile */}
      <div className="lg:hidden">
        <div className="absolute top-[-60px] left-[-80px] [filter:blur(96px)] rounded-full w-72 h-72 bg-gradient-to-br from-[rgba(233,212,255,0.25)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="absolute bottom-[120px] right-[-40px] [filter:blur(96px)] rounded-full w-64 h-64 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
      </div>
      
      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <MentorHeader onBack={handleBack} />

          {/* Search Section */}
          <div className="mt-8">
            <MentorSearch 
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Mentor List */}
          <div className="mt-8">
            <MentorList 
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onClearSearch={handleClearSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMentor;