import { FunctionComponent } from 'react';

const ProfileInfo: FunctionComponent = () => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="text-center">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-[#7008E7] flex items-center justify-center mb-4">
            <span className="text-3xl text-white font-inter">JD</span>
          </div>
          
          {/* Name */}
          <h2 className="text-2xl text-white font-inter mb-2">John Doe</h2>
          
          {/* Role */}
          <p className="text-sm text-gray-400 font-arimo mb-4">Marketing Specialist</p>
          
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#7008E7]/20">
            <span className="text-xs text-[#A684FF] font-arimo">Mentee</span>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#A684FF" strokeWidth="2"/>
              <path d="M22 6l-10 7L2 6" stroke="#A684FF" strokeWidth="2"/>
            </svg>
            <span className="text-sm">john.doe@email.com</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#A684FF" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="#A684FF" strokeWidth="2"/>
            </svg>
            <span className="text-sm">San Francisco, CA</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_161_8802)">
                <path d="M10.6673 13.333V2.66634C10.6673 2.31272 10.5268 1.97358 10.2768 1.72353C10.0267 1.47348 9.68761 1.33301 9.33398 1.33301H6.66732C6.3137 1.33301 5.97456 1.47348 5.72451 1.72353C5.47446 1.97358 5.33398 2.31272 5.33398 2.66634V13.333" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.334 4H2.66732C1.93094 4 1.33398 4.59695 1.33398 5.33333V12C1.33398 12.7364 1.93094 13.3333 2.66732 13.3333H13.334C14.0704 13.3333 14.6673 12.7364 14.6673 12V5.33333C14.6673 4.59695 14.0704 4 13.334 4Z" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_161_8802">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-sm">Marketing Specialist</span>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5.83301V17.4997" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.49935 15C2.27834 15 2.06637 14.9122 1.91009 14.7559C1.75381 14.5996 1.66602 14.3877 1.66602 14.1667V3.33333C1.66602 3.11232 1.75381 2.90036 1.91009 2.74408C2.06637 2.5878 2.27834 2.5 2.49935 2.5H6.66602C7.55007 2.5 8.39792 2.85119 9.02304 3.47631C9.64816 4.10143 9.99935 4.94928 9.99935 5.83333C9.99935 4.94928 10.3505 4.10143 10.9757 3.47631C11.6008 2.85119 12.4486 2.5 13.3327 2.5H17.4993C17.7204 2.5 17.9323 2.5878 18.0886 2.74408C18.2449 2.90036 18.3327 3.11232 18.3327 3.33333V14.1667C18.3327 14.3877 18.2449 14.5996 18.0886 14.7559C17.9323 14.9122 17.7204 15 17.4993 15H12.4993C11.8363 15 11.2004 15.2634 10.7316 15.7322C10.2627 16.2011 9.99935 16.837 9.99935 17.5C9.99935 16.837 9.73596 16.2011 9.26712 15.7322C8.79828 15.2634 8.16239 15 7.49935 15H2.49935Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-lg text-white font-inter">Skills</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">JavaScript</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">React</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">HTML/CSS</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">Git</span>
        </div>
      </div>

      {/* Achievements Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8983 10.7412L14.1608 17.8462C14.1749 17.9299 14.1632 18.0159 14.1271 18.0927C14.0911 18.1695 14.0324 18.2335 13.959 18.276C13.8857 18.3186 13.801 18.3378 13.7164 18.331C13.6319 18.3241 13.5514 18.2917 13.4858 18.2379L10.5024 15.9987C10.3584 15.8911 10.1835 15.833 10.0037 15.833C9.82391 15.833 9.64896 15.8911 9.50494 15.9987L6.5166 18.237C6.45104 18.2907 6.37065 18.3232 6.28618 18.33C6.20171 18.3368 6.11716 18.3177 6.04382 18.2753C5.97048 18.2328 5.91183 18.169 5.8757 18.0923C5.83957 18.0157 5.82768 17.9298 5.8416 17.8462L7.10327 10.7412" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11.667C12.7614 11.667 15 9.42842 15 6.66699C15 3.90557 12.7614 1.66699 10 1.66699C7.23858 1.66699 5 3.90557 5 6.66699C5 9.42842 7.23858 11.667 10 11.667Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-lg text-white font-inter">Achievements</h3>
        </div>
        
        <div className="space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            <h4 className="text-sm text-white font-arimo">First Session Complete</h4>
            <p className="text-xs text-gray-500 mt-1">Nov 15, 2024</p>
          </div>
          
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            <h4 className="text-sm text-white font-arimo">Profile Completed</h4>
            <p className="text-xs text-gray-500 mt-1">Nov 12, 2024</p>
          </div>
          
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">
            <h4 className="text-sm text-white font-arimo">Welcome Badge Earned</h4>
            <p className="text-xs text-gray-500 mt-1">Nov 10, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
