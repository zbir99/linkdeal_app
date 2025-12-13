import { FunctionComponent, useState, useEffect } from 'react';
import { Ticket } from '../../pages/Support_tickets';

interface TicketsListProps {
  searchTerm: string;
  statusFilter: string;
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  onClearFilters: () => void;
}

export const TicketsList: FunctionComponent<TicketsListProps> = ({
  searchTerm,
  statusFilter,
  selectedTicket,
  onSelectTicket,
  onClearFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const tickets: Ticket[] = [
    {
      id: '1',
      subject: 'Payment Issue',
      userName: 'admin',
      userType: 'mentee',
      priority: 'high',
      status: 'open',
      category: 'Payment',
      message: "I can't complete my payment for the session with Jean Dupont. The transaction fails every time.",
      date: '22/11/2024'
    },
    {
      id: '2',
      subject: 'Profile not showing up',
      userName: 'admin',
      userType: 'mentor',
      priority: 'medium',
      status: 'in-progress',
      category: 'Technical',
      message: "My profile doesn't appear in the mentor directory search results.",
      date: '21/11/2024'
    },
    {
      id: '3',
      subject: 'Session cancellation',
      userName: 'admin',
      userType: 'mentee',
      priority: 'low',
      status: 'resolved',
      category: 'Booking',
      message: "I need to cancel my upcoming session but can't find the cancellation button.",
      date: '20/11/2024'
    },
    {
      id: '4',
      subject: 'Unable to upload documents',
      userName: 'admin',
      userType: 'mentor',
      priority: 'high',
      status: 'open',
      category: 'Technical',
      message: "The file upload feature is not working. I'm trying to upload my certifications but getting an error.",
      date: '19/11/2024'
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || ticket.status === statusFilter.toLowerCase().replace(' ', '-');
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'low':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-white/10 border-white/20 text-white/60';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'in-progress':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'resolved':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-white/10 border-white/20 text-white/60';
    }
  };

  // No results state
  if (filteredTickets.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#A684FF" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">No Tickets Found</h3>
        <p className="text-white/60 text-sm mb-6">
          {searchTerm 
            ? `No tickets match your search for "${searchTerm}"`
            : 'No tickets match your current filters'
          }
        </p>
        <button
          onClick={onClearFilters}
          className="px-6 py-2.5 bg-[#7008E7] rounded-lg text-white text-sm hover:bg-[#8B5CF6] hover:scale-105 transition-all duration-200"
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tickets List */}
      <div className="space-y-4">
        {currentTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:bg-white/10 ${
              selectedTicket?.id === ticket.id 
                ? 'border-purple-400/50 bg-white/10' 
                : 'border-white/10'
            }`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white text-base font-normal flex-1">{ticket.subject}</h3>
                <div className={`px-2 py-1 rounded-lg border text-xs font-medium whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">{ticket.userName}</span>
                <div className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs">
                  Admin
                </div>
              </div>

              {/* Message Preview */}
              <p className="text-white/60 text-sm line-clamp-2">{ticket.message}</p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-lg border text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs">
                    {ticket.category}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{ticket.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#7008E7] border-[#7008E7] text-white'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

