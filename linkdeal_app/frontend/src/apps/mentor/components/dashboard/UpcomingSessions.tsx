import { FunctionComponent } from 'react';
import SessionItem from './SessionItem';

const UpcomingSessions: FunctionComponent = () => {
  const sessions = [
    {
      initials: 'SL',
      name: 'Sophie Laurent',
      topic: 'React Hooks',
      date: 'Monday, Nov 25',
      time: '2:00 PM'
    },
    {
      initials: 'TD',
      name: 'Thomas Durand',
      topic: 'Node.js API',
      date: 'Tuesday, Nov 26',
      time: '10:00 AM'
    },
    {
      initials: 'CM',
      name: 'Claire Martin',
      topic: 'TypeScript',
      date: 'Wednesday, Nov 27',
      time: '4:00 PM'
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
      <div>
        <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upcoming Sessions
        </h2>
        <p className="text-xs md:text-sm text-white/60">Stay prepared for your mentees</p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {sessions.map((session) => (
          <SessionItem key={`${session.name}-${session.time}`} {...session} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;
