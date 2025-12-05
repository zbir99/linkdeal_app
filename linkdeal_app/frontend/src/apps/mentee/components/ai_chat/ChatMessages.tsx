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
}

const ChatMessages: FunctionComponent<ChatMessagesProps> = ({ messages }) => {
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

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pl-[43.2px] space-y-3 sm:space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-2xl ${message.sender === 'user' ? 'w-full' : ''}`}>
            <div
              className={`rounded-xl p-3 sm:p-4 ${
                message.sender === 'ai'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-[#2A1A3E]'
              }`}
            >
              {message.file && (
                <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2L18 4L11 11H9V9L16 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-white truncate">{message.file.name}</span>
                </div>
              )}
              <p className="text-sm sm:text-[15px] text-white leading-6">
                {message.text}
              </p>
              <div className="mt-2 text-[10px] sm:text-xs text-white/50">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

