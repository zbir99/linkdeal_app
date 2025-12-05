import { FunctionComponent, useState } from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  isYou: boolean;
}

export const ChatMessages: FunctionComponent = () => {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Dr. Emily Chen',
      text: 'Hello! Ready to start our session?',
      isYou: false,
    },
    {
      id: 2,
      sender: 'You',
      text: "Yes, let's discuss my AI project!",
      isYou: true,
    },
  ]);

  const [messageText, setMessageText] = useState('');

  return (
    <div className="h-full flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-0.5 sm:gap-1 ${message.isYou ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] sm:text-xs text-white/50 px-1">{message.sender}</span>
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                message.isYou
                  ? 'bg-[#7008e7] text-white'
                  : 'bg-white/10 text-white border border-white/10'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-3 sm:p-4 space-y-2 sm:space-y-3 shrink-0">
        {/* Attachments */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-200"
            aria-label="Attach file"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-200"
            aria-label="Attach image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Message input */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-2.5 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200"
          />
          <button 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#7008e7] hover:bg-[#8B5CF6] active:bg-[#6007c5] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-shrink-0"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages as FunctionComponent;
