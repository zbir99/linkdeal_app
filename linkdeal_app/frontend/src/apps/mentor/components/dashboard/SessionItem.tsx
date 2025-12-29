import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionItemProps {
  id: string; // Added ID
  initials: string;
  name: string;
  profileImage?: string | null;
  topic: string;
  date: string;
  time: string;
}

// Helper to get full image URL
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // If it's already an absolute URL (http/https), use as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Otherwise, prepend the API base URL
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return `${apiUrl}${url}`;
};

const SessionItem: FunctionComponent<SessionItemProps> = ({ id, initials, name, profileImage, topic, date, time }) => {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(profileImage);

  const handleJoinSession = () => {
    navigate(`/mentor/vd/${id}`);
  };

  return (
    <div className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-3 md:p-5 flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out">
      <div className="flex items-center gap-3 md:gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-full object-cover"
            onError={(e) => {
              // On error, hide the image and show initials instead
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-full flex items-center justify-center text-sm md:text-base font-semibold text-white" style={{ backgroundColor: '#7008E7' }}>
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm md:text-base font-semibold truncate">{name}</p>
          <p className="text-xs md:text-sm text-white/60 truncate">{topic}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs md:text-sm text-white/70 font-arimo">
        <div className="flex items-center gap-1.5 md:gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 md:w-4 md:h-4">
            <g clipPath="url(#clip0_161_11397)">
              <path d="M8 4V8L10.6667 9.33333" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.00016 14.6673C11.6821 14.6673 14.6668 11.6825 14.6668 8.00065C14.6668 4.31875 11.6821 1.33398 8.00016 1.33398C4.31826 1.33398 1.3335 4.31875 1.3335 8.00065C1.3335 11.6825 4.31826 14.6673 8.00016 14.6673Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_161_11397">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>{time}</span>
        </div>
        <span className="hidden sm:inline text-white/40">•</span>
        <div className="flex items-center gap-1.5 md:gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 md:w-4 md:h-4">
            <path d="M5.3335 1.33398V4.00065" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6665 1.33398V4.00065" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.6667 2.66602H3.33333C2.59695 2.66602 2 3.26297 2 3.99935V13.3327C2 14.0691 2.59695 14.666 3.33333 14.666H12.6667C13.403 14.666 14 14.0691 14 13.3327V3.99935C14 3.26297 13.403 2.66602 12.6667 2.66602Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 6.66602H14" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{date}</span>
        </div>
      </div>

      <button
        onClick={handleJoinSession}
        className="w-full sm:w-auto md:self-auto px-4 py-2 rounded-lg md:rounded-xl bg-[#7008e7] hover:bg-[#6007c5] active:scale-95 transition-all text-xs md:text-sm font-medium shadow-[0_10px_20px_rgba(112,8,231,0.3)]"
      >
        Join
      </button>
    </div>
  );
};

export default SessionItem;
