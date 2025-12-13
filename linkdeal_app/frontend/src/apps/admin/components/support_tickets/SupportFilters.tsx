import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface SupportFiltersProps {
  onSearchChange: (searchTerm: string) => void;
  onStatusChange: (status: string) => void;
}

const SupportFilters: FunctionComponent<SupportFiltersProps> = ({ onSearchChange, onStatusChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setDropdownOpen(false);
    onStatusChange(status);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative z-40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-[523.6px] h-12 sm:flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by user or subject..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 text-white placeholder-white/50 outline-none transition-all focus:border-white/20"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-48 h-9 z-50" ref={dropdownRef}>
          <div 
            className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleDropdownClick}
          >
            <div className="flex h-5 items-center gap-2 relative">
              <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                {selectedStatus}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-[99999]">
              <div className="py-1">
                {['All Status', 'Open', 'In Progress', 'Resolved'].map((status) => (
                  <div
                    key={status}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => handleStatusSelect(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportFilters;
