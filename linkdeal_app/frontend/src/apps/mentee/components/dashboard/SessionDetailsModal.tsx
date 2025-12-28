import { FunctionComponent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string; // Added ID
    initials: string;
    name: string;
    topic: string;
    date: string;
    time: string;
    profilePicture?: string;
    duration?: string;
  } | null;
}

const SessionDetailsModal: FunctionComponent<SessionDetailsModalProps> = ({ isOpen, onClose, session }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const meetingLink = 'https://meet.example.com/sophie-react-hooks';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleJoinSession = () => {
    console.log(`Join Session clicked - navigating to /mentee/video-call/${session.id}`);
    onClose(); // Close modal first
    setTimeout(() => {
      console.log('Attempting navigation...');
      navigate(`/mentee/video-call/${session.id}`, { replace: false });
    }, 100);
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div
          className="bg-[#1a1a2e] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#A684FF" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" stroke="#A684FF" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" stroke="#A684FF" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" stroke="#A684FF" strokeWidth="2" />
                  </svg>
                  <h2 className="text-lg font-bold text-white">Session Details</h2>
                </div>
                <p className="text-sm text-white/60">View details and join your upcoming mentoring session</p>
              </div>

              <button
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200 hover:scale-110"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mentor Info */}
            <div className="flex items-center gap-4">
              {session.profilePicture ? (
                <img
                  src={session.profilePicture}
                  alt={session.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#7008E7] flex items-center justify-center text-white font-semibold text-xl">
                  {session.initials}
                </div>
              )}
              <div>
                <p className="text-sm text-white/60">Mentor</p>
                <p className="text-lg font-semibold text-white">{session.name}</p>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4">
              {/* Topic */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-default group">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5 group-hover:text-purple-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Topic</p>
                    <p className="text-base font-medium text-white">{session.topic}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-default group">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5 group-hover:text-purple-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Date</p>
                      <p className="text-base font-medium text-white">{session.date}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-default group">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5 group-hover:text-purple-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Time</p>
                      <p className="text-base font-medium text-white">{session.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-default group">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5 group-hover:text-purple-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Duration</p>
                    <p className="text-base font-medium text-white">{session.duration || '1 hour'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-4 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 mb-2 group-hover:text-white/80 transition-colors duration-300">Meeting Link</p>
                  <p className="text-sm text-purple-400 break-all group-hover:text-purple-300 transition-colors duration-300">{meetingLink}</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex-shrink-0 p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 hover:border-purple-500/60 hover:scale-110 transition-all duration-200 group/btn"
                  title={copied ? 'Copied!' : 'Copy link'}
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-purple-400 group-hover/btn:text-purple-300 transition-colors duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-2 animate-fade-in">Copied to clipboard!</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-90 transition-transform duration-300">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Close
              </div>
            </button>

            <button
              onClick={handleJoinSession}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7008E7] to-[#8E51FF] text-white text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-xl hover:scale-110 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-200">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Join Session
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add fade-in and scale-in animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};

export default SessionDetailsModal;

