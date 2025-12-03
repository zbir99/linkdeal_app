import { FunctionComponent, useEffect, useRef, useState } from 'react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: FunctionComponent<CategorySelectProps> = ({ value, onChange }) => {
  const categories = [
    'Session Issue',
    'Payment Question',
    'Mentee Support',
    'Platform Feature',
    'Technical Problem',
    'Account Help',
    'Other'
  ];

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (category: string) => {
    onChange(category);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-1/2" ref={dropdownRef}>
      <label className="text-sm text-gray-300 font-semibold">Category *</label>
      <div
        className="flex h-11 items-center justify-between px-3 bg-[#ffffff0d] rounded-xl border border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-[#a683ff]/60 transition-all duration-300 group w-full"
        onClick={handleToggle}
      >
        <span className={`text-sm ${value ? 'text-white' : 'text-[#a0a0a0]'} group-hover:text-white transition-colors duration-300`}>
          {value || 'Select your category'}
        </span>
        <svg
          className={`w-4 h-4 text-[#a0a0a0] transition-transform duration-300 ${open ? 'rotate-180' : 'group-hover:rotate-180'}`}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && (
        <div className="ticket-dropdown-scrollbar absolute z-20 mt-2 w-1/2 rounded-xl border border-[#fffefe1a] bg-[#1a1a2e] shadow-2xl max-h-56 overflow-y-auto">
          <div className="py-1">
            {categories.map((category) => (
              <div
                key={category}
                className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 transition-colors duration-200 cursor-pointer"
                onClick={() => handleSelect(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ticket-dropdown-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .ticket-dropdown-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 3px;
        }
        .ticket-dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        .ticket-dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  );
};

export { CategorySelect };
