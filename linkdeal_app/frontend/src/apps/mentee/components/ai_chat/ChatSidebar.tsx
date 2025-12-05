import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: FunctionComponent<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete chat:', id);
    setOpenDropdownId(null);
  };

  const handleShare = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share chat:', id);
    setOpenDropdownId(null);
  };

  const handleRename = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Rename chat:', id);
    setOpenDropdownId(null);
  };
  const chatHistory = [
    {
      id: 1,
      title: 'React Skills Improvement',
      preview: 'I would like to improve my React skills',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      preview: 'Can you help me understand closures?',
      time: 'Yesterday'
    },
    {
      id: 3,
      title: 'Portfolio Project',
      preview: 'Building a professional portfolio',
      time: '2 days ago'
    },
    {
      id: 4,
      title: 'Technical Interview Prep',
      preview: 'Preparing for coding interviews',
      time: '1 week ago'
    }
  ];

  return (
    <div className={`
      h-full w-[260px] bg-white/5 border-r border-white/10 flex flex-col
      fixed md:static inset-y-0 left-0 z-50 md:z-auto
      transform md:transform-none transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Close button for mobile */}
      <div className="md:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 pt-14 md:pt-4">
        <button className="w-full rounded-xl bg-white/5 border border-white/10 h-[57.6px] flex items-center px-4 gap-3 text-white hover:bg-white/10 transition-all duration-300">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8V24" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16H24" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-base">New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="relative group">
              <div
                className="w-full rounded-lg bg-white/5 p-3 text-left hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => console.log('Open chat:', chat.id)}
              >
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 10C14 10.5304 13.7893 11.0391 13.4142 11.4142C13.0391 11.7893 12.5304 12 12 12H5L2 15V3C2 2.46957 2.21071 1.96086 2.58579 1.58579C2.96086 1.21071 3.46957 1 4 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V10Z" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white leading-[21px] truncate mb-1">
                      {chat.title}
                    </div>
                    <div className="text-xs text-gray-400 leading-[18px] truncate mb-1">
                      {chat.preview}
                    </div>
                    <div className="text-[11px] text-gray-500 leading-[16.5px]">
                      {chat.time}
                    </div>
                  </div>
                  
                  {/* Three Dots Menu Button */}
                  <button
                    onClick={(e) => toggleDropdown(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all duration-200 flex-shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="3" r="1" fill="#9CA3AF"/>
                      <circle cx="8" cy="8" r="1" fill="#9CA3AF"/>
                      <circle cx="8" cy="13" r="1" fill="#9CA3AF"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropdown Menu */}
              {openDropdownId === chat.id && (
                <div 
                  ref={dropdownRef}
                  className="absolute right-2 top-2 mt-8 w-40 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden z-[60]"
                >
                  <button
                    onClick={(e) => handleRename(chat.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6666 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5035 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5035 3.82619 14.4088 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Rename
                  </button>
                  
                  <button
                    onClick={(e) => handleShare(chat.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-colors border-t border-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5.5 7L10.5 4.5M5.5 9L10.5 11.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Share
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="text-xs text-gray-400 text-center">
          AI Coach v1.0
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;

