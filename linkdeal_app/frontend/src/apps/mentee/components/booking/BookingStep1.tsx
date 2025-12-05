import { FunctionComponent, useState } from 'react';

interface BookingStep1Props {
  onContinue: () => void;
}

const BookingStep1: FunctionComponent<BookingStep1Props> = ({ onContinue }) => {
  const [selectedDate] = useState('Nov 26, 2024');
  const [selectedTime, setSelectedTime] = useState('16:00');
  const [sessionTopic, setSessionTopic] = useState('');

  const timeSlots = [
    '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="w-full flex flex-col items-start gap-6 mr-8">
      {/* Title */}
      <div className="w-full h-9">
        <h2 className="text-[28px] font-inter text-white leading-9">Select Date & Time</h2>
      </div>

      {/* Form Fields */}
      <div className="w-full flex flex-col items-start gap-6">
        {/* Date Selection */}
        <div className="w-full h-[65px] flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Preferred Date</label>
          <div className="w-full h-9 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-between px-3 py-0 gap-5 text-center text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <span className="text-[14px] font-arimo leading-5">{selectedDate}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Time Selection */}
        <div className="w-full h-[174.2px] flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Preferred Time</label>
          <div className="w-full h-[145.2px] relative text-center text-white">
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`h-[66.6px] rounded-lg border-[0.8px] backdrop-blur-md flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 ${selectedTime === time
                      ? 'bg-[#7008E7]/30 border-[#7008E7]/50'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_161_9402)">
                      <path d="M8 4V8L10.6667 9.33333" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.99967 14.6663C11.6816 14.6663 14.6663 11.6816 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 11.6816 4.31778 14.6663 7.99967 14.6663Z" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_161_9402">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-[14px] font-arimo leading-[21px]">{time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Session Topic */}
        <div className="w-full h-[77px] flex flex-col items-start gap-2">
          <label className="text-[14px] font-arimo text-gray-400 leading-[21px]">Session Topic</label>
          <div className="w-full h-12 rounded-lg bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden flex items-center px-3 py-1 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full bg-transparent outline-none text-[14px] font-arimo placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full h-12 rounded-lg bg-[#7008E7] text-[14px] font-arimo text-white hover:bg-[#5a07b8] transition-all duration-300 shadow-lg shadow-[#7008E7]/30 hover:shadow-xl hover:shadow-[#7008E7]/50"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default BookingStep1;
