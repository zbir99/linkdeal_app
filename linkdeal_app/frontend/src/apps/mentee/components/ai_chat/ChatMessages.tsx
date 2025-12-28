import { FunctionComponent, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  hasRecommendations?: boolean;
  onViewMentors?: () => void;
}

const ChatMessages: FunctionComponent<ChatMessagesProps> = ({
  messages,
  isLoading,
  hasRecommendations = false,
  onViewMentors
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if message contains recommendation text
  const isRecommendationMessage = (text: string) => {
    return text.toLowerCase().includes('found') &&
      (text.toLowerCase().includes('mentor') || text.toLowerCase().includes('recommendation'));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pl-[43.2px] space-y-3 sm:space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-2xl ${message.sender === 'user' ? 'w-full' : ''}`}>
            <div
              className={`rounded-xl p-3 sm:p-4 ${message.sender === 'ai'
                ? 'bg-white/5 border border-white/10'
                : 'bg-[#2A1A3E]'
                }`}
            >
              {message.file && (
                <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 2L18 4L11 11H9V9L16 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-white truncate">{message.file.name}</span>
                </div>
              )}
              <p className="text-sm sm:text-[15px] text-white leading-6">
                {message.text}
              </p>

              {/* View Mentors Button - Only show on mobile when there are recommendations */}
              {message.sender === 'ai' && hasRecommendations && isRecommendationMessage(message.text) && onViewMentors && (
                <button
                  onClick={onViewMentors}
                  className="lg:hidden mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white text-sm font-semibold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>View Recommended Mentors</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              <div className="mt-2 text-[10px] sm:text-xs text-white/50">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-2xl">
            <div className="rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
