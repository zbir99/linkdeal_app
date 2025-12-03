import { FunctionComponent } from 'react';

export const MenteesStats: FunctionComponent = () => {
  const stats = [
    { 
      label: 'Total Mentees', 
      value: '15',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#7008E7" fillOpacity="0.2"/>
          <path d="M26.6667 28.3327V25.8327C26.6667 24.5406 26.1536 23.3014 25.2409 22.3887C24.3282 21.476 23.089 20.9627 21.7969 20.9627H18.2031C16.911 20.9627 15.6718 21.476 14.7591 22.3887C13.8464 23.3014 13.3333 24.5406 13.3333 25.8327V28.3327" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 17.9167C21.6109 17.9167 22.9167 16.6109 22.9167 15C22.9167 13.3891 21.6109 12.0833 20 12.0833C18.3891 12.0833 17.0833 13.3891 17.0833 15C17.0833 16.6109 18.3891 17.9167 20 17.9167Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      label: 'Active', 
      value: '12',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#22C55E" fillOpacity="0.2"/>
          <path d="M28.3333 14.166L17.9167 24.5827L13.3333 19.9993" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      label: 'Total Sessions', 
      value: '127',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#3B82F6" fillOpacity="0.2"/>
          <path d="M16.6667 11.666V14.9993" stroke="#60A5FA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23.3333 11.666V14.9993" stroke="#60A5FA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25.8333 13.334H14.1667C13.2462 13.334 12.5 14.0802 12.5 15.0007V26.6673C12.5 27.5878 13.2462 28.334 14.1667 28.334H25.8333C26.7538 28.334 27.5 27.5878 27.5 26.6673V15.0007C27.5 14.0802 26.7538 13.334 25.8333 13.334Z" stroke="#60A5FA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.5 18.334H27.5" stroke="#60A5FA" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      label: 'Avg Rating', 
      value: '4.9',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#FBBF24" fillOpacity="0.2"/>
          <path d="M19.6042 11.9118C19.6407 11.838 19.6971 11.7759 19.7671 11.7324C19.837 11.689 19.9177 11.666 20 11.666C20.0824 11.666 20.163 11.689 20.233 11.7324C20.3029 11.7759 20.3593 11.838 20.3959 11.9118L22.3209 15.8109C22.4477 16.0676 22.6349 16.2896 22.8664 16.458C23.0979 16.6263 23.3668 16.736 23.65 16.7776L27.955 17.4076C28.0366 17.4194 28.1132 17.4538 28.1763 17.5069C28.2393 17.56 28.2862 17.6297 28.3117 17.7081C28.3372 17.7865 28.3403 17.8704 28.3205 17.9505C28.3008 18.0305 28.259 18.1034 28.2 18.1609L25.0867 21.1926C24.8814 21.3927 24.7278 21.6397 24.6391 21.9123C24.5504 22.1849 24.5292 22.475 24.5775 22.7576L25.3125 27.0409C25.3269 27.1225 25.3181 27.2064 25.2871 27.2832C25.2561 27.3599 25.2041 27.4264 25.1371 27.4751C25.0702 27.5237 24.9908 27.5526 24.9082 27.5583C24.8257 27.5641 24.7431 27.5465 24.67 27.5076L20.8217 25.4843C20.5681 25.3511 20.286 25.2816 19.9996 25.2816C19.7132 25.2816 19.4311 25.3511 19.1775 25.4843L15.33 27.5076C15.257 27.5463 15.1745 27.5637 15.0921 27.5578C15.0096 27.5519 14.9305 27.5231 14.8636 27.4744C14.7968 27.4258 14.7449 27.3594 14.7139 27.2828C14.6829 27.2061 14.6741 27.1223 14.6884 27.0409L15.4225 22.7584C15.471 22.4757 15.45 22.1854 15.3613 21.9126C15.2726 21.6398 15.1189 21.3927 14.9134 21.1926L11.8 18.1618C11.7405 18.1043 11.6984 18.0313 11.6783 17.951C11.6583 17.8707 11.6612 17.7864 11.6868 17.7078C11.7123 17.6291 11.7594 17.5591 11.8228 17.5059C11.8861 17.4527 11.9631 17.4183 12.045 17.4068L16.3492 16.7776C16.6327 16.7363 16.902 16.6268 17.1338 16.4584C17.3657 16.29 17.5531 16.0678 17.68 15.8109L19.6042 11.9118Z" stroke="#FBBF24" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 transform group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              {stat.icon}
            </div>
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
