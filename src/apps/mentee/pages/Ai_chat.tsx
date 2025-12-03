import { FunctionComponent, useState } from 'react';
import { ChatSidebar, ChatHeader, ChatMessages, ChatInput } from '../components/ai_chat';

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

const AiChat: FunctionComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello Jean! I'm your AI coach. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = (text: string, file?: File) => {
    if (!text.trim() && !file) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date(),
      file: file ? {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      } : undefined
    };

    setMessages([...messages, newMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I understand your question. Let me help you with that...",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden flex">
      {/* Background Effects */}
      <div className="absolute bottom-0 left-0 w-96 h-96 [filter:blur(128px)] rounded-full bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none" />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChatHeader onToggleSidebar={toggleSidebar} />

        {/* Messages */}
        <ChatMessages messages={messages} />

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default AiChat;
