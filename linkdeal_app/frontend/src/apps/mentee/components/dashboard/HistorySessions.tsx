import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const HistorySessions: FunctionComponent = () => {
  const navigate = useNavigate();
  
  const onViewAllClick = () => {
    navigate('/mentee/session-history');
  };

  const sessions = [
    {
      id: 1,
      name: 'Marie Dupont',
      timeAgo: '2 days ago'
    },
    {
      id: 2,
      name: 'John Smith',
      timeAgo: '1 week ago'
    },
    {
      id: 3,
      name: 'Mark Belge',
      timeAgo: '2 weeks ago'
    }
  ];

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="#A684FF" strokeWidth="2"/>
          </svg>
          <h2 className="text-lg font-semibold text-white">History</h2>
        </div>
        
        {/* View All Button */}
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_508_1892)">
              <path d="M0.693111 5.40003C0.638755 5.25477 0.638755 5.09498 0.693111 4.94974C1.22252 3.6764 2.12116 2.58767 3.27511 1.82157C4.42906 1.05547 5.78634 0.646484 7.17489 0.646484C8.56345 0.646484 9.92081 1.05547 11.0748 1.82157C12.2287 2.58767 13.1273 3.6764 13.6567 4.94974C13.7111 5.09498 13.7111 5.25477 13.6567 5.40003C13.1273 6.67335 12.2287 7.76211 11.0748 8.52819C9.92081 9.29427 8.56345 9.7033 7.17489 9.7033C5.78634 9.7033 4.42906 9.29427 3.27511 8.52819C2.12116 7.76211 1.22252 6.67335 0.693111 5.40003Z" stroke="white" strokeWidth="1.29918" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g clipPath="url(#clip1_508_1892)">
              <path d="M7.04258 6.81758C8.02289 6.81758 8.81754 6.02289 8.81754 5.04258C8.81754 4.06227 8.02289 3.26758 7.04258 3.26758C6.06227 3.26758 5.26758 4.06227 5.26758 5.04258C5.26758 6.02289 6.06227 6.81758 7.04258 6.81758Z" stroke="white" strokeWidth="1.18333" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_508_1892">
                <rect width="14.675" height="10.675" fill="white"/>
              </clipPath>
              <clipPath id="clip1_508_1892">
                <rect width="5.325" height="5.325" fill="white" transform="translate(4.67578 2.67578)"/>
              </clipPath>
            </defs>
          </svg>
          View All
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            <div className="flex flex-col gap-1">
              <div className="text-white font-medium text-sm">{session.name}</div>
              <div className="text-gray-400 text-xs">{session.timeAgo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySessions;

