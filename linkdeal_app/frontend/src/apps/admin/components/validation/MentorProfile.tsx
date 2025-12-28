import { FunctionComponent } from 'react';

interface MentorProfileProps {
  name: string;
  professionalTitle: string;
  email: string;
  location: string;
  profilePictureUrl?: string; // Optional
  initials: string;
}

const MentorProfile: FunctionComponent<MentorProfileProps> = ({
  name,
  professionalTitle,
  email,
  location,
  profilePictureUrl,
  initials
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Avatar and Name */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center overflow-hidden bg-[#7008E7]">
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">{initials}</span>
          )}
        </div>

        {/* Name and Domain */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">{name}</h2>
          <p className="text-white/70 text-sm sm:text-base">{professionalTitle}</p>
        </div>

        {/* Status Badge - Static Pending for Validation Context */}
        <div className="transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            Pending Approval
          </span>
        </div>

        {/* Contact Information */}
        <div className="w-full space-y-3 text-left pt-4">
          <div className="flex items-center gap-3 text-white/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 flex-shrink-0">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm truncate">{email}</span>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 flex-shrink-0">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm truncate">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
