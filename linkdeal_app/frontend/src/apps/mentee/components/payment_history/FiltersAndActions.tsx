import { FunctionComponent, ChangeEvent } from 'react';

export interface FiltersAndActionsProps {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onExport?: () => void;
}

const FiltersAndActions: FunctionComponent<FiltersAndActionsProps> = ({
  searchQuery,
  onSearchChange,
  onExport
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  return (
    <div className="relative z-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-5 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full text-gray-500">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 18L14.65 14.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Export Button */}
        <button
          onClick={onExport}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#7008E7] px-6 h-12 text-base font-semibold text-white transition-colors hover:bg-[#5a07b8] shadow-[0_20px_45px_rgba(112,8,231,0.45)] whitespace-nowrap"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13V3M10 13L6 9M10 13L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 17H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export Report
        </button>
      </div>
    </div>
  );
};

export { FiltersAndActions };
