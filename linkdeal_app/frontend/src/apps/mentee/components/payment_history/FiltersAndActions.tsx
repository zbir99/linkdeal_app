import { FunctionComponent, useState, useRef, useEffect, ChangeEvent } from 'react';

export interface FiltersAndActionsProps {
  searchQuery: string;
  filterType: string;
  onSearchChange?: (query: string) => void;
  onFilterChange?: (type: string) => void;
}

const FiltersAndActions: FunctionComponent<FiltersAndActionsProps> = ({
  searchQuery,
  filterType,
  onSearchChange,
  onFilterChange
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(filterType);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedType(filterType);
  }, [filterType]);

  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setDropdownOpen(false);
    if (onFilterChange) {
      onFilterChange(type);
    }
  };

  return (
    <div className="relative z-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-5 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 18L14.65 14.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7008E7]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full flex-1 relative" ref={dropdownRef}>
          <div 
            className="flex h-12 items-center justify-between px-3 py-0 relative w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleDropdownClick}
          >
            <div className="flex h-5 items-center gap-2 relative">
              <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                {selectedType === 'all' ? 'All Types' : selectedType === 'income' ? 'Income' : 'Payout'}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {dropdownOpen && (
            <div className="ticket-dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-2xl z-30 max-h-48 overflow-y-auto">
              <div className="py-1">
                <div
                  className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleTypeSelect('all')}
                >
                  All Types
                </div>
                <div
                  className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleTypeSelect('income')}
                >
                  Income
                </div>
                <div
                  className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleTypeSelect('payout')}
                >
                  Payout
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button className="w-full lg:flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#7008E7] px-8 h-14 text-base font-semibold text-white transition-colors hover:bg-[#5a07b8] shadow-[0_20px_45px_rgba(112,8,231,0.45)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13V3M10 13L6 9M10 13L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 17H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export Report
        </button>
      </div>
    </div>
  );
};

export { FiltersAndActions };
