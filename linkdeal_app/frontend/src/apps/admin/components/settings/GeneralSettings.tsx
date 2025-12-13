import { FunctionComponent, useState, useRef, useEffect } from 'react';

const GeneralSettings: FunctionComponent = () => {
  const [platformName, setPlatformName] = useState('LinkDeal');
  const [platformUrl, setPlatformUrl] = useState('https://linkdeal.com');
  const [supportEmail, setSupportEmail] = useState('support@linkdeal.com');
  const [timezone, setTimezone] = useState('Europe/Paris (CET)');
  const [language, setLanguage] = useState('English');
  
  // Dropdown states
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const isDropdownOpen = timezoneDropdownOpen || languageDropdownOpen;
  
  // Refs for dropdown containers
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target as Node)) {
        setTimezoneDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle dropdown clicks - close other dropdown
  const handleTimezoneDropdownClick = () => {
    setTimezoneDropdownOpen(!timezoneDropdownOpen);
    if (languageDropdownOpen) {
      setLanguageDropdownOpen(false);
    }
  };
  
  const handleLanguageDropdownClick = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
    if (timezoneDropdownOpen) {
      setTimezoneDropdownOpen(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-visible group hover:border-white/15 transition-all duration-300 ${
        isDropdownOpen ? 'z-20' : 'z-10'
      }`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative p-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99935 18.3334C14.6017 18.3334 18.3327 14.6024 18.3327 10C18.3327 5.39765 14.6017 1.66669 9.99935 1.66669C5.39698 1.66669 1.66602 5.39765 1.66602 10C1.66602 14.6024 5.39698 18.3334 9.99935 18.3334Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.99935 1.66669C7.85954 3.91348 6.66602 6.8973 6.66602 10C6.66602 13.1027 7.85954 16.0866 9.99935 18.3334C12.1392 16.0866 13.3327 13.1027 13.3327 10C13.3327 6.8973 12.1392 3.91348 9.99935 1.66669Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.66602 10H18.3327" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">General Settings</h2>
            <p className="text-sm text-white/60">Configure platform basics and regional preferences</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Platform Name
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
            />
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Display name for your platform
            </p>
          </div>

          {/* Platform URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Platform URL
              <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse" />
            </label>
            <input
              type="url"
              value={platformUrl}
              onChange={(e) => setPlatformUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
            />
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                <path d="M6 3V6L8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Main platform web address
            </p>
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Support Email
              <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" />
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
            />
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4L6 6L9 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="1" y="3" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Contact email for support requests
            </p>
          </div>

          {/* Default Timezone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Default Timezone
              <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" />
            </label>
            <div className="relative w-full" ref={timezoneDropdownRef}>
              <div 
                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
                onClick={handleTimezoneDropdownClick}
              >
                <div className="flex h-5 items-center gap-2 relative">
                  <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                    {timezone || 'Select timezone'}
                  </div>
                </div>
                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className={`w-4 h-4 transition-transform duration-300 ${timezoneDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {timezoneDropdownOpen && (
                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-50 max-h-48 overflow-y-auto">
                  <div className="py-1">
                    {[
                      'UTC-12:00 (Baker Island)',
                      'UTC-11:00 (American Samoa)',
                      'UTC-10:00 (Hawaii)',
                      'UTC-09:00 (Alaska)',
                      'UTC-08:00 (Pacific Time)',
                      'UTC-07:00 (Mountain Time)',
                      'UTC-06:00 (Central Time)',
                      'UTC-05:00 (Eastern Time)',
                      'UTC-04:00 (Atlantic Time)',
                      'UTC-03:00 (Buenos Aires)',
                      'UTC-02:00 (Mid-Atlantic)',
                      'UTC-01:00 (Azores)',
                      'UTC+00:00 (London)',
                      'UTC+01:00 (Paris)',
                      'UTC+02:00 (Cairo)',
                      'UTC+03:00 (Moscow)',
                      'UTC+04:00 (Dubai)',
                      'UTC+05:00 (Karachi)',
                      'UTC+06:00 (Dhaka)',
                      'UTC+07:00 (Bangkok)',
                      'UTC+08:00 (Beijing)',
                      'UTC+09:00 (Tokyo)',
                      'UTC+10:00 (Sydney)',
                      'UTC+11:00 (Solomon Islands)',
                      'UTC+12:00 (Auckland)'
                    ].map((tz) => (
                      <div
                        key={tz}
                        className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          setTimezone(tz);
                          setTimezoneDropdownOpen(false);
                        }}
                      >
                        {tz}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Default Language */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Default Language
              <div className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" />
            </label>
            <div className="relative w-full" ref={languageDropdownRef}>
              <div 
                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
                onClick={handleLanguageDropdownClick}
              >
                <div className="flex h-5 items-center gap-2 relative">
                  <div className="w-fit whitespace-nowrap relative mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center tracking-[0] leading-5 group-hover:text-white transition-colors duration-300">
                    {language || 'Select language'}
                  </div>
                </div>
                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className={`w-4 h-4 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {languageDropdownOpen && (
                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-50 max-h-48 overflow-y-auto">
                  <div className="py-1">
                    {[
                      'English',
                      'Spanish',
                      'French',
                      'German',
                      'Italian',
                      'Portuguese',
                      'Dutch',
                      'Russian',
                      'Chinese',
                      'Japanese',
                      'Korean',
                      'Arabic',
                      'Hindi',
                      'Turkish',
                      'Polish',
                      'Swedish',
                      'Norwegian',
                      'Danish',
                      'Finnish',
                      'Greek'
                    ].map((lang) => (
                      <div
                        key={lang}
                        className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          setLanguage(lang);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 14L4 9L5.41 7.59L9 11.17L15.59 4.58L17 6L9 14Z" fill="#A684FF"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Platform Configuration</h3>
                <p className="text-xs text-white/60">{platformName} • {language} • {timezone}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">Active</div>
              <div className="text-xs text-white/60">Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
