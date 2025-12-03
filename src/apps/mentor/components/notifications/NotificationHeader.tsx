import { FunctionComponent } from 'react';

interface NotificationHeaderProps {
  onBack: () => void;
  onMarkAllRead: () => void;
}

const NotificationHeader: FunctionComponent<NotificationHeaderProps> = ({ onBack, onMarkAllRead }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.6914 28C13.9255 28.4054 14.2621 28.742 14.6675 28.976C15.0728 29.21 15.5327 29.3332 16.0007 29.3332C16.4688 29.3332 16.9286 29.21 17.334 28.976C17.7394 28.742 18.076 28.4054 18.3101 28" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.35031 20.4345C4.17613 20.6254 4.06118 20.8628 4.01945 21.1179C3.97772 21.3729 4.011 21.6346 4.11525 21.871C4.2195 22.1075 4.39023 22.3086 4.60665 22.4498C4.82308 22.591 5.07588 22.6663 5.33431 22.6665H26.6676C26.926 22.6666 27.1789 22.5916 27.3955 22.4506C27.612 22.3097 27.783 22.1088 27.8875 21.8725C27.992 21.6362 28.0256 21.3746 27.9842 21.1196C27.9428 20.8645 27.8282 20.627 27.6543 20.4358C25.881 18.6078 24.001 16.6652 24.001 10.6665C24.001 8.54477 23.1581 6.50994 21.6578 5.00965C20.1575 3.50936 18.1227 2.6665 16.001 2.6665C13.8792 2.6665 11.8444 3.50936 10.3441 5.00965C8.84383 6.50994 8.00098 8.54477 8.00098 10.6665C8.00098 16.6652 6.11965 18.6078 4.35031 20.4345Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-3xl lg:text-4xl text-white font-inter">Notifications</h1>
            <div className="rounded-lg bg-[rgba(251,44,54,0.2)] border-[rgba(251,44,54,0.3)] px-2 py-1 text-xs text-[#ff6467] font-medium hover:bg-[rgba(251,44,54,0.3)] hover:border-[rgba(251,44,54,0.4)] hover:scale-110 transition-all duration-300 cursor-pointer">
              2 new
            </div>
          </div>
          <p className="text-base text-gray-500 font-arimo">
            Stay updated with your latest activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_168_1600)">
                <path d="M11.9997 4L4.66634 11.3333L1.33301 8" stroke="#D1D5DC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.667 6.6665L9.66699 11.6665L8.66699 10.6665" stroke="#D1D5DC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_168_1600">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Mark All Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;

