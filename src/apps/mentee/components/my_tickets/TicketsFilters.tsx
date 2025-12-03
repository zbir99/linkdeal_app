import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface TicketsFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const TicketsFilters: FunctionComponent<TicketsFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = ['All Status', 'Open', 'In Progress', 'Resolved'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by user or subject..."
            className="w-full h-12 pl-10 pr-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 transition-colors"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Status Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-xl text-white flex items-center justify-between hover:border-purple-400/50 transition-colors"
          >
            <span>{statusFilter || 'All Status'}</span>
            <svg 
              className={`w-4 h-4 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status === 'All Status' ? '' : status);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-purple-600/30 hover:text-purple-200 transition-colors"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

