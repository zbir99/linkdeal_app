import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface MenteesSearchProps {
  onSearchChange?: (searchTerm: string, filterStatus: string, sortBy: string) => void;
  searchTerm?: string;
  filterStatus?: string;
  sortBy?: string;
}

export const MenteesSearch: FunctionComponent<MenteesSearchProps> = ({ 
  onSearchChange,
  searchTerm = '',
  filterStatus = '',
  sortBy = ''
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideStatusDropdown = statusDropdownRef.current?.contains(target);
      const isInsideSortDropdown = sortDropdownRef.current?.contains(target);

      if (!isInsideStatusDropdown) {
        setStatusDropdownOpen(false);
      }
      if (!isInsideSortDropdown) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusDropdownClick = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
    if (sortDropdownOpen) {
      setSortDropdownOpen(false);
    }
  };

  const handleSortDropdownClick = () => {
    setSortDropdownOpen(!sortDropdownOpen);
    if (statusDropdownOpen) {
      setStatusDropdownOpen(false);
    }
  };

  const statusOptions = ['All Status', 'Active', 'Inactive'];
  const sortOptions = ['Sort By', 'Name', 'Rating', 'Sessions', 'Last Session'];

  const getStatusLabel = () => {
    if (!filterStatus) return 'All Status';
    return filterStatus === 'active' ? 'Active' : 'Inactive';
  };

  const getSortLabel = () => {
    if (!sortBy) return 'Sort By';
    switch (sortBy) {
      case 'name':
        return 'Name';
      case 'rating':
        return 'Rating';
      case 'sessions':
        return 'Sessions';
      case 'last session':
        return 'Last Session';
      default:
        return 'Sort By';
    }
  };

  const handleSearchInputChange = (value: string) => {
    onSearchChange?.(value, filterStatus, sortBy);
  };

  const handleStatusSelect = (option: string) => {
    const normalized = option === 'All Status' ? '' : option.toLowerCase();
    onSearchChange?.(searchTerm, normalized, sortBy);
    setStatusDropdownOpen(false);
  };

  const handleSortSelect = (option: string) => {
    const normalized = option === 'Sort By' ? '' : option.toLowerCase();
    onSearchChange?.(searchTerm, filterStatus, normalized);
    setSortDropdownOpen(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search mentees..."
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <div className="relative flex-1 sm:flex-none" ref={statusDropdownRef}>
            <div 
              className="flex h-9 sm:h-10 items-center justify-between px-3 sm:px-4 py-0 bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group min-w-0"
              onClick={handleStatusDropdownClick}
            >
              <div className="flex h-5 items-center gap-2 min-w-0">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-xs sm:text-sm text-center leading-5 group-hover:text-white transition-colors duration-300">
                  {getStatusLabel()}
                </div>
              </div>
              <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2">
                <svg className={`w-4 h-4 transition-transform duration-300 ${statusDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-20 max-h-48 overflow-y-auto min-w-[140px]">
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 text-xs sm:text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                      onClick={() => handleStatusSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
            <div 
              className="flex h-9 sm:h-10 items-center justify-between px-3 sm:px-4 py-0 bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group min-w-0"
              onClick={handleSortDropdownClick}
            >
              <div className="flex h-5 items-center gap-2 min-w-0">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-xs sm:text-sm text-center leading-5 group-hover:text-white transition-colors duration-300">
                  {getSortLabel()}
                </div>
              </div>
              <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2">
                <svg className={`w-4 h-4 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {sortDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-20 max-h-48 overflow-y-auto min-w-[140px]">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 text-xs sm:text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                      onClick={() => handleSortSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
