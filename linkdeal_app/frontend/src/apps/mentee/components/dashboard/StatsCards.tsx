import { FunctionComponent } from 'react';

const StatsCards: FunctionComponent = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 text-green-400 font-arimo">
      {/* Completed Sessions */}
      <div className="rounded-xl md:rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-4 md:p-6 flex flex-col gap-4 md:gap-6 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out min-h-[160px] md:min-h-[180px] overflow-hidden">
        <div className="w-full flex items-center gap-2 md:gap-3">
          <svg className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#7008E7" fillOpacity="0.2" />
            <path d="M20 14V18" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 14V18" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 16H17C15.8954 16 15 16.8954 15 18V32C15 33.1046 15.8954 34 17 34H31C32.1046 34 33 33.1046 33 32V18C33 16.8954 32.1046 16 31 16Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 22H33" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-xs md:text-sm text-white/70 font-arimo truncate">Completed Sessions</p>
        </div>
        <div className="w-full flex items-center justify-between gap-3 flex-1">
          <div className="text-2xl md:text-3xl text-white font-inter font-bold">
            12
          </div>
          <div className="h-6 md:h-7 px-2 md:px-3 rounded-full bg-[#00C950]/10 border border-[#00C950]/20 flex items-center justify-center backdrop-blur-sm whitespace-nowrap flex-shrink-0">
            <span className="text-xs md:text-sm leading-4 text-[#05DF72] font-medium">+2 <span className="hidden sm:inline">this month</span></span>
          </div>
        </div>
      </div>

      {/* Next Session */}
      <div className="rounded-xl md:rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-4 md:p-6 flex flex-col gap-4 md:gap-6 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out min-h-[160px] md:min-h-[180px] overflow-hidden">
        <div className="w-full flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <svg className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#7008E7" fillOpacity="0.2" />
              <g transform="translate(13, 13)">
                <path d="M8 2V6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2V6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 10H21" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <p className="text-xs md:text-sm text-white/70 font-arimo">Next Session</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-1 flex-1 justify-center">
          <div className="text-base md:text-lg text-white font-inter font-semibold">
            Monday 2:00 PM
          </div>
          <div className="text-[10px] md:text-xs text-gray-500">
            with Marie Dupont
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
