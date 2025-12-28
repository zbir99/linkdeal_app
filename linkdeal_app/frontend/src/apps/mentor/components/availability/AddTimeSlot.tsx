import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface AddTimeSlotProps {
  onAddSlot: (day: string, startTime: string, endTime: string) => void;
}

export const AddTimeSlot: FunctionComponent<AddTimeSlotProps> = ({ onAddSlot }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const [startTimeDropdownOpen, setStartTimeDropdownOpen] = useState(false);
  const [endTimeDropdownOpen, setEndTimeDropdownOpen] = useState(false);

  const dayDropdownRef = useRef<HTMLDivElement>(null);
  const startTimeDropdownRef = useRef<HTMLDivElement>(null);
  const endTimeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideDayDropdown = dayDropdownRef.current?.contains(target);
      const isInsideStartTimeDropdown = startTimeDropdownRef.current?.contains(target);
      const isInsideEndTimeDropdown = endTimeDropdownRef.current?.contains(target);

      if (!isInsideDayDropdown) {
        setDayDropdownOpen(false);
      }
      if (!isInsideStartTimeDropdown) {
        setStartTimeDropdownOpen(false);
      }
      if (!isInsideEndTimeDropdown) {
        setEndTimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDayDropdownClick = () => {
    setDayDropdownOpen(!dayDropdownOpen);
    if (startTimeDropdownOpen) {
      setStartTimeDropdownOpen(false);
    }
    if (endTimeDropdownOpen) {
      setEndTimeDropdownOpen(false);
    }
  };

  const handleStartTimeDropdownClick = () => {
    setStartTimeDropdownOpen(!startTimeDropdownOpen);
    if (dayDropdownOpen) {
      setDayDropdownOpen(false);
    }
    if (endTimeDropdownOpen) {
      setEndTimeDropdownOpen(false);
    }
  };

  const handleEndTimeDropdownClick = () => {
    setEndTimeDropdownOpen(!endTimeDropdownOpen);
    if (dayDropdownOpen) {
      setDayDropdownOpen(false);
    }
    if (startTimeDropdownOpen) {
      setStartTimeDropdownOpen(false);
    }
  };

  const handleAddSlot = () => {
    if (selectedDay && startTime && endTime) {
      onAddSlot(selectedDay, startTime, endTime);
      setSelectedDay('');
      setStartTime('');
      setEndTime('');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Filter end times to only show times after the selected start time
  const getAvailableEndTimes = () => {
    if (!startTime) return times;
    return times.filter(time => time > startTime);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Add Time Slot</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative w-full" ref={dayDropdownRef}>
          <div
            className="flex h-9 items-center justify-between px-3 py-0 w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleDayDropdownClick}
          >
            <div className="flex h-5 items-center gap-2">
              <div className="w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center leading-5 group-hover:text-white transition-colors duration-300">
                {selectedDay || 'Select day'}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${dayDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {dayDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-10 max-h-48 overflow-y-auto">
              <div className="py-1">
                {days.map((day) => (
                  <div
                    key={day}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setSelectedDay(day);
                      setDayDropdownOpen(false);
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full" ref={startTimeDropdownRef}>
          <div
            className="flex h-9 items-center justify-between px-3 py-0 w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleStartTimeDropdownClick}
          >
            <div className="flex h-5 items-center gap-2">
              <div className="w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center leading-5 group-hover:text-white transition-colors duration-300">
                {startTime || 'Start time'}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${startTimeDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {startTimeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-10 max-h-48 overflow-y-auto">
              <div className="py-1">
                {times.map((time) => (
                  <div
                    key={time}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setStartTime(time);
                      setStartTimeDropdownOpen(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full" ref={endTimeDropdownRef}>
          <div
            className="flex h-9 items-center justify-between px-3 py-0 w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff1a] hover:border-purple-400/50 transition-all duration-300 group"
            onClick={handleEndTimeDropdownClick}
          >
            <div className="flex h-5 items-center gap-2">
              <div className="w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-[#a0a0a0] text-sm text-center leading-5 group-hover:text-white transition-colors duration-300">
                {endTime || 'End time'}
              </div>
            </div>
            <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg className={`w-4 h-4 transition-transform duration-300 ${endTimeDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {endTimeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] shadow-xl z-10 max-h-48 overflow-y-auto">
              <div className="py-1">
                {getAvailableEndTimes().map((time) => (
                  <div
                    key={time}
                    className="px-3 py-2 text-sm text-[#a0a0a0] hover:bg-purple-600/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setEndTime(time);
                      setEndTimeDropdownOpen(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAddSlot}
          disabled={!selectedDay || !startTime || !endTime}
          className="px-4 py-3 rounded-lg bg-[#7008E7] text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 hover:bg-[#8B5CF6] hover:shadow-xl transition-all duration-300 transform flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#7008E7]"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.16675 10H15.8334" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 4.16602V15.8327" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Slot
        </button>
      </div>
    </div>
  );
};
