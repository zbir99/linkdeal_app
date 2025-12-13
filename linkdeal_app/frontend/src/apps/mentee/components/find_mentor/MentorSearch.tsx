import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface MentorSearchProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

const MentorSearch: FunctionComponent<MentorSearchProps> = ({ 
  searchTerm, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange 
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All Categories',
    'Development',
    'Design',
    'Data Science',
    'DevOps',
    'Product Management',
    'Marketing'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryDropdownClick = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'Category:', selectedCategory);
  };

  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md p-6 relative z-20">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, skills, or expertise..."
            className="w-full rounded-xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md px-12 py-3 text-white placeholder-gray-400 outline-none focus:bg-white/10 focus:border-[#7008E7] transition-all duration-300"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full lg:w-80" ref={categoryDropdownRef}>
          <div 
            className="flex h-12 items-center justify-between px-3 py-0 relative w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleCategoryDropdownClick}
          >
            <div className="flex h-5 items-center gap-2 relative">
              <div className="w-fit whitespace-nowrap relative mt-[-1.00px] font-arimo font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                {selectedCategory}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-30 max-h-48 overflow-y-auto">
              <div className="py-1">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200 font-arimo"
                    onClick={() => {
                      onCategoryChange(category);
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MentorSearch;
