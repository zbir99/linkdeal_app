import { FunctionComponent, useState } from 'react';

const SecuritySettings: FunctionComponent = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/15 transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative p-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6673 10.8333C16.6673 15 13.7507 17.0833 10.284 18.2916C10.1025 18.3532 9.90527 18.3502 9.72565 18.2833C6.25065 17.0833 3.33398 15 3.33398 10.8333V4.99997C3.33398 4.77895 3.42178 4.56699 3.57806 4.41071C3.73434 4.25443 3.9463 4.16663 4.16732 4.16663C5.83398 4.16663 7.91732 3.16663 9.36732 1.89997C9.54386 1.74913 9.76845 1.66626 10.0007 1.66626C10.2329 1.66626 10.4574 1.74913 10.634 1.89997C12.0923 3.17497 14.1673 4.16663 15.834 4.16663C16.055 4.16663 16.267 4.25443 16.4232 4.41071C16.5795 4.56699 16.6673 4.77895 16.6673 4.99997V10.8333Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">Security Settings</h2>
            <p className="text-sm text-white/60">Configure authentication and security parameters</p>
          </div>
        </div>

        {/* Security Options */}
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              Two-Factor Authentication
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            </label>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-white font-medium">Require 2FA for all admin accounts</h3>
                <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Enhanced security protection
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 cursor-pointer ${
                  twoFactorAuth 
                    ? 'bg-purple-500 hover:bg-purple-600 hover:scale-110 hover:shadow-lg shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    twoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Security Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Session Timeout */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                Session Timeout
                <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sessionTimeout}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '' || !isNaN(Number(value))) {
                      setSessionTimeout(value);
                    }
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setSessionTimeout(String(parseInt(sessionTimeout) + 5))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 1L6 3L2 3L4 1Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionTimeout(String(Math.max(1, parseInt(sessionTimeout) - 5)))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7L2 5L6 5L4 7Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">min</div>
              </div>
            </div>

            {/* Password Expiry */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                Password Expiry
                <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={passwordExpiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '' || !isNaN(Number(value))) {
                      setPasswordExpiry(value);
                    }
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setPasswordExpiry(String(parseInt(passwordExpiry) + 7))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 1L6 3L2 3L4 1Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasswordExpiry(String(Math.max(1, parseInt(passwordExpiry) - 7)))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7L2 5L6 5L4 7Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">days</div>
              </div>
            </div>

            {/* Max Login Attempts */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                Max Login Attempts
                <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={maxLoginAttempts}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '' || !isNaN(Number(value))) {
                      setMaxLoginAttempts(value);
                    }
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 focus:border-[#7008E7] focus:outline-none focus:ring-2 focus:ring-[#7008E7]/20 transition-all duration-300 text-white placeholder:text-white/40 hover:bg-white/10 hover:border-white/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setMaxLoginAttempts(String(parseInt(maxLoginAttempts) + 1))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 1L6 3L2 3L4 1Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxLoginAttempts(String(Math.max(1, parseInt(maxLoginAttempts) - 1)))}
                    className="w-4 h-4 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7L2 5L6 5L4 7Z" fill="#A684FF" className="group-hover:fill-purple-300 transition-colors"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono"></div>
              </div>
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
                <h3 className="text-sm font-medium text-white">Security Configuration Active</h3>
                <p className="text-xs text-white/60">2FA: {twoFactorAuth ? 'Enabled' : 'Disabled'} • Session: {sessionTimeout}min</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">{passwordExpiry} days</div>
              <div className="text-xs text-white/60">Password Cycle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
