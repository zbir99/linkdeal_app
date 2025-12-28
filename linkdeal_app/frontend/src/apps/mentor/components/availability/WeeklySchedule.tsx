import { FunctionComponent } from 'react';

interface TimeSlot {
  id?: string;
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  onRemoveSlot: (day: string, slotIndex: number) => void;
}

export const WeeklySchedule: FunctionComponent<WeeklyScheduleProps> = ({ schedule, onRemoveSlot }) => {

  const SlotCard: FunctionComponent<{ slot: TimeSlot; day: string; slotIndex: number }> = ({ slot, day, slotIndex }) => (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#7008E7]/20 flex items-center justify-center group-hover:bg-[#7008E7]/30 transition-colors duration-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-white/90 font-medium">{slot.start} - {slot.end}</span>
      </div>
      <button
        onClick={() => onRemoveSlot(day, slotIndex)}
        className="text-white/50 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  const DayCard: FunctionComponent<{ schedule: DaySchedule }> = ({ schedule }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{schedule.day}</h3>
        <div className="px-3 py-1.5 rounded-full bg-[#7008E7]/20 border border-[#7008E7]/30 text-[#A684FF] text-sm font-medium">
          {schedule.slots.length} slots
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {schedule.slots.length > 0 ? (
          schedule.slots.map((slot, index) => (
            <SlotCard key={`${slot.start}-${slot.end}-${index}`} slot={slot} day={schedule.day} slotIndex={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-white/50">
            No availability set
          </div>
        )}
      </div>
    </div>
  );

  // Filter days that have slots
  const daysWithSlots = schedule.filter(day => day.slots.length > 0);

  return (
    <div className="space-y-6">
      {daysWithSlots.length > 0 ? (
        daysWithSlots.map((daySchedule) => (
          <DayCard key={daySchedule.day} schedule={daySchedule} />
        ))
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Availability Set</h3>
          <p className="text-white/60 text-sm">You have not set the availability days yet</p>
        </div>
      )}
    </div>
  );
};
