import { FunctionComponent } from 'react';

interface Mentee {
  id: string;
  name: string;
  initials: string;
  sessions: number;
  totalHours: number;
  rating: number;
}

interface MenteeProfileCardProps {
  mentee?: Mentee;
}

export const MenteeProfileCard: FunctionComponent<MenteeProfileCardProps> = ({ mentee }) => {
  // Default mentee data if none provided
  const defaultMentee = {
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    sessions: 8,
    totalHours: 8,
    completedSessions: 7,
    avgRating: 4.2
  };

  const data = mentee ? {
    ...defaultMentee,
    name: mentee.name,
    initials: mentee.initials,
    sessions: mentee.sessions,
    totalHours: mentee.totalHours,
    avgRating: mentee.rating
  } : defaultMentee;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar and Info */}
        <div className="flex items-center gap-6 flex-1">
          <div className="w-20 h-20 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-4xl font-normal">{data.initials}</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-white text-3xl font-normal mb-2">{data.name}</h1>
            <p className="text-white/60 text-sm mb-1">{data.email}</p>
            <p className="text-white/60 text-sm">{data.sessions} sessions • {data.totalHours}h total</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[110px]">
            <div className="text-white text-2xl font-normal mb-1">{data.completedSessions}</div>
            <div className="text-white/60 text-xs">Completed</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[110px]">
            <div className="text-white text-2xl font-normal mb-1">{data.avgRating.toFixed(1)}</div>
            <div className="text-white/60 text-xs">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

