import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface UserFiltersProps {
  onFilterChange: (searchTerm: string, selectedRole: string, selectedStatus: string) => void;
  searchTerm: string;
  selectedRole: string;
  selectedStatus: string;
}

const UserFilters: FunctionComponent<UserFiltersProps> = ({ onFilterChange, searchTerm, selectedRole, selectedStatus }) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRoleDropdownClick = () => {
    setRoleDropdownOpen(!roleDropdownOpen);
    if (statusDropdownOpen) {
      setStatusDropdownOpen(false);
    }
  };

  const handleStatusDropdownClick = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
    if (roleDropdownOpen) {
      setRoleDropdownOpen(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    onFilterChange(searchTerm, role, selectedStatus);
    setRoleDropdownOpen(false);
  };

  const handleStatusSelect = (status: string) => {
    onFilterChange(searchTerm, selectedRole, status);
    setStatusDropdownOpen(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative z-40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-[400px] h-12 sm:flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onFilterChange(e.target.value, selectedRole, selectedStatus)}
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-10 pr-3 text-white placeholder-white/50 outline-none transition-all focus:border-white/20"
          />
        </div>

        {/* Role Dropdown */}
        <div className={`relative w-full sm:w-48 h-9 ${roleDropdownOpen ? 'z-[100]' : 'z-50'}`} ref={roleDropdownRef}>
          <div 
            className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleRoleDropdownClick}
          >
            <div className="flex h-5 items-center gap-2 relative">
              <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                {selectedRole}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${roleDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {roleDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl">
              <div className="py-1">
                {['All Roles', 'Admin', 'Mentor', 'Mentee'].map((role) => (
                  <div
                    key={role}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className={`relative w-full sm:w-48 h-9 ${statusDropdownOpen ? 'z-[100]' : 'z-50'}`} ref={statusDropdownRef}>
          <div 
            className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleStatusDropdownClick}
          >
            <div className="flex h-5 items-center gap-2 relative">
              <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                {selectedStatus}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${statusDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {statusDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl">
              <div className="py-1">
                {['All Status', 'Active', 'Inactive', 'Suspended'].map((status) => (
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

export default UserFilters;
