import { FunctionComponent, useState, useRef, useEffect } from 'react';

export const BasicInformation: FunctionComponent = () => {
  const [language, setLanguage] = useState('english');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <style>{`
        .dropdown-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.7), rgba(168, 132, 255, 0.7));
          border-radius: 4px;
        }
        
        .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.9), rgba(168, 132, 255, 0.9));
        }
      `}</style>
      <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-2">Full Name</label>
          <input
            type="text"
            defaultValue="Marie Dupont"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Email Address</label>
          <input
            type="email"
            defaultValue="marie.dupont@example.com"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Professional Title</label>
          <input
            type="text"
            defaultValue="Full-Stack Developer"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Location</label>
          <input
            type="text"
            defaultValue="Paris, France"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div className="relative" ref={languageDropdownRef}>
          <label className="block text-white/80 text-sm mb-2">Language</label>
          <div
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer hover:border-purple-400/50 hover:bg-white/15 transition-all duration-200 group"
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          >
            <span className={`text-sm ${language ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
              {language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Select your language'}
            </span>
            <svg className={`w-5 h-5 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {languageDropdownOpen && (
            <div className="dropdown-scrollbar absolute left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-[#fffefe30] shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto overflow-x-hidden">
              <div className="py-2">
                {['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'].map((lang) => (
                  <div
                    key={lang}
                    className="px-4 py-3 text-sm text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setLanguage(lang.toLowerCase());
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

        <div>
          <label className="block text-white/80 text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">LinkedIn Profile</label>
          <input
            type="url"
            defaultValue="https://linkedin.com/in/mariedupont"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};
