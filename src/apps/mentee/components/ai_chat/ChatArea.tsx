import { FunctionComponent } from 'react';

const ChatArea: FunctionComponent = () => {
  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md p-6 h-[600px] overflow-hidden flex flex-col shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-[#7008E7]/10 transition-all duration-500">
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
        {/* AI Message */}
        <div className="flex justify-start group">
          <div className="rounded-2xl bg-gradient-to-br from-[#7008E7]/20 to-[#A684FF]/20 max-w-[500px] p-4 shadow-lg shadow-[#7008E7]/20 hover:shadow-xl hover:shadow-[#7008E7]/30 transition-all duration-300 hover:scale-[1.02] border border-[#7008E7]/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7008E7] to-[#A684FF] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.66667 3.75161C9.72456 3.44575 9.88786 3.1695 10.1283 2.9707C10.3687 2.77191 10.6713 2.66309 10.9835 2.66309C11.2957 2.66309 11.5983 2.77191 11.8387 2.9707C12.0791 3.1695 12.2424 3.44575 12.3003 3.75161L13.7117 11.1623C13.8121 11.6891 14.0705 12.1738 14.4526 12.5529C14.8347 12.932 15.3229 13.1881 15.8533 13.2876L23.3412 14.6889C23.6495 14.7461 23.9278 14.9084 24.1281 15.1477C24.3284 15.3871 24.4377 15.6885 24.4377 15.9996C24.4377 16.3108 24.3284 16.6121 24.1281 16.8515C23.9278 17.0908 23.6495 17.2531 23.3412 17.3103L15.8533 18.7116C15.3229 18.8111 14.8347 19.0672 14.4526 19.4463C14.0705 19.8255 13.8121 20.3101 13.7117 20.8369L12.3003 28.2476C12.2424 28.5535 12.0791 28.8297 11.8387 29.0285C11.5983 29.2273 11.2957 29.3361 10.9835 29.3361C10.6713 29.3361 10.3687 29.2273 10.1283 29.0285C9.88786 28.8297 9.72456 28.5535 9.66667 28.2476L8.25526 20.8369C8.15485 20.3101 7.89646 19.8255 7.51437 19.4463C7.13228 19.0672 6.64408 18.8111 6.11367 18.7116L-1.37421 17.3103C-1.68251 17.2531 -1.96081 17.0908 -2.16111 16.8515C-2.36141 16.6121 -2.4707 16.3108 -2.4707 15.9996C-2.4707 15.6885 -2.36141 15.3871 -2.16111 15.1477C-1.96081 14.9084 -1.68251 14.7461 -1.37421 14.6889L6.11367 13.2876C6.64408 13.1881 7.13228 12.932 7.51437 12.5529C7.89646 12.1738 8.15485 11.6891 8.25526 11.1623L9.66667 3.75161Z" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white text-sm leading-6">
                Hello Jean! I'm your AI coach. How can I help you today?
              </p>
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex justify-end">
          <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/10 max-w-[300px] p-4 shadow-lg shadow-white/10 border border-white/20">
            <div className="flex items-start gap-3">
              <p className="text-white text-sm leading-6 flex-1">
                I would like to improve my React skills
              </p>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7008E7] to-[#A684FF] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex justify-start group">
          <div className="rounded-2xl bg-gradient-to-br from-[#7008E7]/20 to-[#A684FF]/20 max-w-[500px] p-4 shadow-lg shadow-[#7008E7]/20 hover:shadow-xl hover:shadow-[#7008E7]/30 transition-all duration-300 hover:scale-[1.02] border border-[#7008E7]/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7008E7] to-[#A684FF] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.66667 3.75161C9.72456 3.44575 9.88786 3.1695 10.1283 2.9707C10.3687 2.77191 10.6713 2.66309 10.9835 2.66309C11.2957 2.66309 11.5983 2.77191 11.8387 2.9707C12.0791 3.1695 12.2424 3.44575 12.3003 3.75161L13.7117 11.1623C13.8121 11.6891 14.0705 12.1738 14.4526 12.5529C14.8347 12.932 15.3229 13.1881 15.8533 13.2876L23.3412 14.6889C23.6495 14.7461 23.9278 14.9084 24.1281 15.1477C24.3284 15.3871 24.4377 15.6885 24.4377 15.9996C24.4377 16.3108 24.3284 16.6121 24.1281 16.8515C23.9278 17.0908 23.6495 17.2531 23.3412 17.3103L15.8533 18.7116C15.3229 18.8111 14.8347 19.0672 14.4526 19.4463C14.0705 19.8255 13.8121 20.3101 13.7117 20.8369L12.3003 28.2476C12.2424 28.5535 12.0791 28.8297 11.8387 29.0285C11.5983 29.2273 11.5957 29.3361 10.9835 29.3361C10.6713 29.3361 10.3687 29.2273 10.1283 29.0285C9.88786 28.8297 9.72456 28.5535 9.66667 28.2476L8.25526 20.8369C8.15485 20.3101 7.89646 19.8255 7.51437 19.4463C7.13228 19.0672 6.64408 18.8111 6.11367 18.7116L-1.37421 17.3103C-1.68251 17.2531 -1.96081 17.0908 -2.16111 16.8515C-2.36141 16.6121 -2.4707 16.3108 -2.4707 15.9996C-2.4707 15.6885 -2.36141 15.3871 -2.16111 15.1477C-1.96081 14.9084 -1.68251 14.7461 -1.37421 14.6889L6.11367 13.2876C6.64408 13.1881 7.13228 12.932 7.51437 12.5529C7.89646 12.1738 8.15485 11.6891 8.25526 11.1623L9.66667 3.75161Z" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white text-sm leading-6">
                Excellent initiative! React is a powerful framework. To better guide you, could you tell me your current skill level and your specific goals?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
