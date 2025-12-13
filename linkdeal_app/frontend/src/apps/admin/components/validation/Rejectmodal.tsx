import { FunctionComponent, useEffect } from 'react';

interface RejectModalProps {
  onCancel: () => void;
  onSendEmail: () => void;
}

const RejectModal: FunctionComponent<RejectModalProps> = ({ onCancel, onSendEmail }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original scroll behavior when modal closes
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Custom scrollbar styles
  const scrollbarStyles = `
    .purple-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .purple-scrollbar::-webkit-scrollbar-track {
      background: #2a2a3e;
      border-radius: 4px;
    }
    .purple-scrollbar::-webkit-scrollbar-thumb {
      background: #a684ff;
      border-radius: 4px;
    }
    .purple-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #8b6cf0;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-[700px] bg-[#1a1a2e] rounded-[10px] shadow-xl flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3327 5.83325L10.8402 10.6058C10.5859 10.7534 10.2971 10.8312 10.0031 10.8312C9.70907 10.8312 9.42027 10.7534 9.16602 10.6058L1.66602 5.83325" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.666 3.33325H3.33268C2.41221 3.33325 1.66602 4.07944 1.66602 4.99992V14.9999C1.66602 15.9204 2.41221 16.6666 3.33268 16.6666H16.666C17.5865 16.6666 18.3327 15.9204 18.3327 14.9999V4.99992C18.3327 4.07944 17.5865 3.33325 16.666 3.33325Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-lg font-bold text-white">Send Rejection Email</h2>
            </div>
            <button 
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex flex-col gap-4 flex-1">
            {/* To Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#9ca3af] font-arimo">To</label>
              <input
                type="email"
                defaultValue="alex.dubois@email.com"
                className="w-full h-9 px-3 py-1 rounded-lg bg-[#2a2a3e] border border-[#4a4a6a] text-white text-sm focus:outline-none focus:border-[#a684ff] transition-colors"
              />
            </div>

            {/* Subject Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#9ca3af] font-arimo">Subject</label>
              <input
                type="text"
                defaultValue="Regarding Your Mentor Application"
                className="w-full h-9 px-3 py-1 rounded-lg bg-[#2a2a3e] border border-[#4a4a6a] text-white text-sm focus:outline-none focus:border-[#a684ff] transition-colors"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-[#9ca3af] font-arimo">Message</label>
              <textarea
                defaultValue="Dear Alexandre Dubois,

Thank you for your interest in becoming a mentor on our platform.

After careful review of your application, we regret to inform you that we are unable to approve your mentor application at this time.

We encourage you to reapply in the future.

Best regards,
The Team"
                className="w-full flex-1 min-h-[200px] px-3 py-2 rounded-lg bg-[#2a2a3e] border border-[#4a4a6a] text-white text-sm focus:outline-none focus:border-[#a684ff] resize-none transition-colors purple-scrollbar"
              />
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="flex items-center justify-end gap-3 p-6">
            <button 
              onClick={onCancel}
              className="h-9 px-4 rounded-lg border border-[#4a4a6a] bg-transparent text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Cancel</span>
            </button>
            <button 
              onClick={onSendEmail}
              className="h-9 px-4 rounded-lg bg-red-600 border border-red-700 text-white hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_500_1215)">
                  <path d="M9.69119 14.4572C9.71652 14.5203 9.76055 14.5742 9.81737 14.6116C9.87419 14.6489 9.94109 14.668 10.0091 14.6663C10.0771 14.6646 10.1429 14.6421 10.1977 14.6018C10.2526 14.5616 10.2938 14.5055 10.3159 14.4412L14.6492 1.77454C14.6705 1.71547 14.6746 1.65154 14.6609 1.59024C14.6473 1.52894 14.6164 1.4728 14.572 1.42839C14.5276 1.38398 14.4715 1.35314 14.4102 1.33947C14.3489 1.3258 14.2849 1.32987 14.2259 1.35121L1.55919 5.68454C1.49485 5.7066 1.4388 5.74782 1.39857 5.80266C1.35833 5.85749 1.33584 5.92332 1.33409 5.99131C1.33235 6.05931 1.35145 6.1262 1.38883 6.18303C1.4262 6.23985 1.48007 6.28388 1.54319 6.30921L6.82986 8.42921C6.99698 8.49612 7.14882 8.59618 7.27623 8.72336C7.40364 8.85054 7.50398 9.0022 7.57119 9.16921L9.69119 14.4572Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.5687 1.4314L7.27539 8.72406" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_500_1215">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-sm">Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RejectModal;