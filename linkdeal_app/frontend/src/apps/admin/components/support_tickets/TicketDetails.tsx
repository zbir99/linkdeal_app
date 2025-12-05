import { FunctionComponent, useState, useEffect, useRef } from 'react';

interface TicketDetailsProps {
  ticket: any;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isSupport: boolean;
}

const TicketDetails: FunctionComponent<TicketDetailsProps> = ({ ticket }) => {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const getMessagesForTicket = (ticket: any): Message[] => {
    return [
      {
        id: '1',
        sender: ticket.user,
        content: ticket.description,
        timestamp: `${ticket.date} 14:00`,
        isSupport: false
      },
      {
        id: '2',
        sender: 'Support Team',
        content: `Hi ${ticket.user}, I've checked your profile settings. Your profile was set to 'Hidden' in the visibility settings. I've updated it to 'Public' for you.`,
        timestamp: `${ticket.date} 14:30`,
        isSupport: true
      },
      {
        id: '3',
        sender: ticket.user,
        content: "Thank you! It's working now.",
        timestamp: `${ticket.date} 15:00`,
        isSupport: false
      }
    ];
  };

  // Update messages when ticket changes
  useEffect(() => {
    if (ticket) {
      setMessages(getMessagesForTicket(ticket));
    } else {
      setMessages([]);
    }
  }, [ticket?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = () => {
    if (reply.trim() && ticket) {
      const now = new Date();
      const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        sender: 'Support Team',
        content: reply,
        timestamp: timestamp,
        isSupport: true
      };
      
      setMessages([...messages, newMessage]);
      setReply('');
    }
  };

  if (!ticket) {
    return (
      <div className="hidden lg:flex rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-md min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Message */}
          <h3 className="text-white text-lg font-medium mb-2">No Ticket Selected</h3>
          <p className="text-white/60 text-sm">Select a ticket to view details</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'Medium':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'Urgent':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'Low':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'In Progress':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'Resolved':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-white text-xl sm:text-2xl font-normal">{ticket.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <svg className="w-4 h-4 text-purple-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <span className="text-white text-sm">{ticket.user}</span>
              <div className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white/60 text-xs">
                {ticket.userType}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#7008E7] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#8B5CF6]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSupport ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md rounded-xl p-4 space-y-2 ${
                message.isSupport
                  ? 'bg-[#2A1A3E] border border-purple-400/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#A684FF] font-medium">{message.sender}</span>
                <span className="text-white/40">{message.timestamp}</span>
          </div>
              <p className="text-white text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="border-t border-white/10 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
              placeholder="Type your response..."
            className="flex-1 h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-purple-400/50 transition-colors"
            />
          <button
            onClick={handleSendReply}
            disabled={!reply.trim()}
            className="px-4 py-3 bg-[#7008E7] rounded-xl text-white hover:bg-[#8B5CF6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
