import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import {
  AvailabilityHeader,
  AddTimeSlot,
  WeeklySchedule,
  AvailabilityActions
} from '../components/availability';

interface ApiTimeSlot {
  id: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

interface TimeSlot {
  id?: string;
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const dayNameToNumber: { [key: string]: number } = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6
};

const dayNumberToName: { [key: number]: string } = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

const Availability: FunctionComponent = () => {
  const navigate = useNavigate();
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving] = useState(false);

  // Fetch existing availability on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/scheduling/mentor/availability/');
        const slots: ApiTimeSlot[] = response.data;

        // Group slots by day
        const groupedByDay: { [key: string]: TimeSlot[] } = {};

        slots.forEach(slot => {
          const dayName = dayNumberToName[slot.day_of_week];
          if (!groupedByDay[dayName]) {
            groupedByDay[dayName] = [];
          }
          groupedByDay[dayName].push({
            id: slot.id,
            start: slot.start_time.slice(0, 5), // Format "HH:MM"
            end: slot.end_time.slice(0, 5)
          });
        });

        // Convert to DaySchedule array
        const schedule: DaySchedule[] = Object.entries(groupedByDay).map(([day, slots]) => ({
          day,
          slots
        }));

        setWeeklySchedule(schedule);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setErrorMessage('Failed to load availability');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleAddSlot = async (day: string, startTime: string, endTime: string) => {
    try {
      // Create slot via API
      const response = await api.post('/scheduling/mentor/availability/', {
        day_of_week: dayNameToNumber[day],
        start_time: startTime + ':00', // Add seconds
        end_time: endTime + ':00',
        is_recurring: true,
        is_available: true
      });

      const newSlot: TimeSlot = {
        id: response.data.id,
        start: startTime,
        end: endTime
      };

      setWeeklySchedule(prevSchedule => {
        const existingDayIndex = prevSchedule.findIndex(d => d.day === day);

        if (existingDayIndex !== -1) {
          const updatedSchedule = [...prevSchedule];
          updatedSchedule[existingDayIndex] = {
            ...updatedSchedule[existingDayIndex],
            slots: [...updatedSchedule[existingDayIndex].slots, newSlot]
          };
          return updatedSchedule;
        } else {
          return [...prevSchedule, { day, slots: [newSlot] }];
        }
      });

      // Show success feedback
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error: any) {
      console.error('Failed to add slot:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to add time slot');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  const handleRemoveSlot = async (day: string, slotIndex: number) => {
    try {
      const daySchedule = weeklySchedule.find(d => d.day === day);
      if (!daySchedule) return;

      const slot = daySchedule.slots[slotIndex];
      if (!slot.id) return;

      // Delete slot via API
      await api.delete(`/scheduling/mentor/availability/${slot.id}/`);

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
          .filter(daySchedule => daySchedule.slots.length > 0);
      });
    } catch (error: any) {
      console.error('Failed to remove slot:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to remove time slot');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  const handleSave = () => {
    // All changes are already saved to backend in real-time
    setShowSuccessMessage(true);
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
                  <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-green-400 font-medium text-sm sm:text-base">Availability saved successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showErrorMessage && (
          <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 animate-fade-in">
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-lg">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-red-400 font-medium text-sm sm:text-base">{errorMessage}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <AddTimeSlot onAddSlot={handleAddSlot} />
            <WeeklySchedule schedule={weeklySchedule} onRemoveSlot={handleRemoveSlot} />
            {weeklySchedule.length > 0 && (
              <AvailabilityActions onSave={handleSave} onCancel={handleCancel} isSaving={isSaving} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;