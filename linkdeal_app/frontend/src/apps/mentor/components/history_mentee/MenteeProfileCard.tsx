import { FunctionComponent } from 'react';

interface Mentee {
  id: string;
  name: string;
  email?: string;
  initials: string;
  sessions: number;
  totalHours: number;
  completedSessions?: number;
  rating?: number;
  lastSession?: string;
  profilePicture?: string;
  fieldOfStudy?: string;
  country?: string;
  startedAt?: string;
  status?: string;
}

interface MenteeProfileCardProps {
  mentee?: Mentee;
}

export const MenteeProfileCard: FunctionComponent<MenteeProfileCardProps> = ({ mentee }) => {
  // Default mentee data if none provided
  const defaultMentee: Mentee = {
    id: '',
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    sessions: 0,
    totalHours: 0,
    completedSessions: 0,
    rating: 0
  };

  const data = mentee || defaultMentee;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'paused':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'ended':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar and Info */}
        <div className="flex items-center gap-6 flex-1">
          <div className="w-20 h-20 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {data.profilePicture ? (
              <img
                src={data.profilePicture}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-4xl font-normal">{data.initials}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-white text-3xl font-normal">{data.name}</h1>
              {data.status && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(data.status)}`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              )}
            </div>
            {data.email && (
              <p className="text-white/60 text-sm mb-1">{data.email}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/60 text-sm">
              <span>{data.sessions} sessions • {data.totalHours}h total</span>
              {data.fieldOfStudy && (
                <span>• {data.fieldOfStudy}</span>
              )}
              {data.country && (
                <span>• {data.country}</span>
              )}
            </div>
            {data.startedAt && (
              <p className="text-white/40 text-xs mt-1">
                Member since {formatDate(data.startedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[110px]">
            <div className="text-white text-2xl font-normal mb-1">{data.completedSessions ?? 0}</div>
            <div className="text-white/60 text-xs">Completed</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[110px]">
            <div className="text-white text-2xl font-normal mb-1">{(data.rating ?? 0).toFixed(1)}</div>
            <div className="text-white/60 text-xs">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};
