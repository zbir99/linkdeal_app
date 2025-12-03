import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AvailabilityHeader,
  AddTimeSlot,
  WeeklySchedule,
  AvailabilityActions
} from '../components/availability';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const Availability: FunctionComponent = () => {
  const navigate = useNavigate();
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleAddSlot = (day: string, startTime: string, endTime: string) => {
    setWeeklySchedule(prevSchedule => {
      const existingDayIndex = prevSchedule.findIndex(d => d.day === day);
      
      if (existingDayIndex !== -1) {
        // Day exists, add slot to it
        const updatedSchedule = [...prevSchedule];
        updatedSchedule[existingDayIndex] = {
          ...updatedSchedule[existingDayIndex],
          slots: [...updatedSchedule[existingDayIndex].slots, { start: startTime, end: endTime }]
        };
        return updatedSchedule;
      } else {
        // Day doesn't exist, create new day with slot
        return [...prevSchedule, { day, slots: [{ start: startTime, end: endTime }] }];
      }
    });
  };

  const handleRemoveSlot = (day: string, slotIndex: number) => {
    setWeeklySchedule(prevSchedule => {
      return prevSchedule
        .map(daySchedule => {
          if (daySchedule.day === day) {
            return {
              ...daySchedule,
              slots: daySchedule.slots.filter((_, index) => index !== slotIndex)
            };
          }
          return daySchedule;
        })
        .filter(daySchedule => daySchedule.slots.length > 0); // Remove days with no slots
    });
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving availability...', weeklySchedule);
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleCancel = () => {
    navigate('/mentor/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[138.4px] left-[515.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <AvailabilityHeader onBack={handleBack} />
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
            <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-green-400 font-medium text-sm sm:text-base">Availability saved successfully!</span>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <AddTimeSlot onAddSlot={handleAddSlot} />
          <WeeklySchedule schedule={weeklySchedule} onRemoveSlot={handleRemoveSlot} />
          {weeklySchedule.length > 0 && (
            <AvailabilityActions onSave={handleSave} onCancel={handleCancel} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Availability;