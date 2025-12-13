import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenteesHeader } from '../components/my_mentees/MenteesHeader';
import { MenteesSearch } from '../components/my_mentees/MenteesSearch';
import { MenteesStats } from '../components/my_mentees/MenteesStats';
import { MenteesList } from '../components/my_mentees/MenteesList';

const My_Mentees: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleSearchChange = (term: string, status: string, sort: string) => {
    setSearchTerm(term);
    setFilterStatus(status);
    setSortBy(sort);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setSortBy('');
  };

  const handleViewAllSessions = () => {
    navigate('/mentor/all-sessions');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute top-[126px] left-[761px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
        <div className="absolute top-[714px] left-[371px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-200/20 to-blue-300/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <MenteesHeader onBack={handleBack} />
        
        <div className="space-y-4 sm:space-y-6">
          <MenteesSearch 
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            sortBy={sortBy}
          />
          <MenteesStats />
          
          {/* View All Sessions Button */}
          <div className="flex justify-end">
            <button
              onClick={handleViewAllSessions}
              className="group px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#7008E7] to-[#8B5CF6] rounded-lg text-white text-xs sm:text-sm font-medium flex items-center gap-2 hover:from-[#8B5CF6] hover:to-[#9D6CFF] hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform active:scale-95"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="hidden xs:inline">View All Sessions</span>
              <span className="xs:hidden">All Sessions</span>
            </button>
          </div>
          
          <MenteesList 
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            sortBy={sortBy}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default My_Mentees;