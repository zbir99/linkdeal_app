import { FunctionComponent, useState, useEffect } from 'react';

interface Ticket {
  id: number;
  title: string;
  user: string;
  userType: 'Mentee' | 'Mentor';
  priority: 'High' | 'Medium' | 'Urgent' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  category: 'Payment' | 'Feature' | 'Billing' | 'Technical';
  description: string;
  date: string;
}

interface TicketListProps {
  searchTerm: string;
  statusFilter: string;
  onClearSearch: () => void;
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicketId: number | null;
}

const TicketList: FunctionComponent<TicketListProps> = ({ 
  searchTerm, 
  statusFilter, 
  onClearSearch, 
  onTicketSelect, 
  selectedTicketId 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3;
  const tickets: Ticket[] = [
    {
      id: 1,
      title: 'Payment Issue',
      user: 'Sophie Martin',
      userType: 'Mentee',
      priority: 'High',
      status: 'Open',
      category: 'Payment',
      description: 'I can\'t complete my payment for the session with Jean Dupont. The transaction fails every time.',
      date: '22/11/2024'
    },
    {
      id: 2,
      title: 'Question about availability',
      user: 'Thomas Bernard',
      userType: 'Mentor',
      priority: 'Medium',
      status: 'In Progress',
      category: 'Feature',
      description: 'How can I block time slots for my vacation?',
      date: '22/11/2024'
    },
    {
      id: 3,
      title: 'Session cancelled without notice',
      user: 'Julie Petit',
      userType: 'Mentee',
      priority: 'High',
      status: 'Open',
      category: 'Billing',
      description: 'My mentor cancelled our session 10 minutes before it started. I request a refund.',
      date: '21/11/2024'
    },
    {
      id: 4,
      title: 'Profile not showing up',
      user: 'Marc Durand',
      userType: 'Mentor',
      priority: 'Medium',
      status: 'Resolved',
      category: 'Technical',
      description: 'My profile doesn\'t appear in the mentor directory search results.',
      date: '21/11/2024'
    },
    {
      id: 5,
      title: 'Can\'t access video session',
      user: 'Claire Moreau',
      userType: 'Mentee',
      priority: 'Urgent',
      status: 'In Progress',
      category: 'Technical',
      description: 'The video call interface doesn\'t load when I try to join my scheduled session.',
      date: '20/11/2024'
    },
    {
      id: 6,
      title: 'Billing inquiry',
      user: 'Alex Dubois',
      userType: 'Mentee',
      priority: 'Medium',
      status: 'Open',
      category: 'Billing',
      description: 'I was charged twice for the same session. Please refund one of the charges.',
      date: '19/11/2024'
    },
    {
      id: 7,
      title: 'Feature request',
      user: 'Marie Laurent',
      userType: 'Mentor',
      priority: 'Low',
      status: 'In Progress',
      category: 'Feature',
      description: 'It would be great to have a calendar integration feature.',
      date: '18/11/2024'
    }
  ];

  // Filter tickets based on search term and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = searchTerm === '' || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
    <div className="space-y-6">
      {/* No Results State */}
      {filteredTickets.length === 0 && (searchTerm !== '' || statusFilter !== 'All Status') && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#a684ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets found</h3>
          <p className="text-white/60 mb-6">
            {searchTerm !== '' && statusFilter !== 'All Status' 
              ? `No tickets match "${searchTerm}" with status "${statusFilter}"`
              : searchTerm !== '' 
                ? `No tickets match "${searchTerm}"`
                : `No tickets with status "${statusFilter}"`
            }
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-600/30 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Ticket List */}
      {filteredTickets.length > 0 && (
        <div className="space-y-4">
          {currentTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onTicketSelect(ticket)}
            className={`rounded-2xl border p-5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer ${
              selectedTicketId === ticket.id 
                ? 'bg-purple-600/20 border-purple-500/30' 
                : 'bg-white/5 border-white/10'
            }`}
          >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{ticket.title}</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>{ticket.user}</span>
                <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-white">
                  {ticket.userType}
                </span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-lg border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </div>
          </div>

          <p className="text-white/70 text-sm mb-4 line-clamp-2">{ticket.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg border text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-white">
                {ticket.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/50 text-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V8H2V2H8Z" fill="currentColor"/>
                <path d="M22 2V8H16V2H22Z" fill="currentColor"/>
                <path d="M8 16V22H2V16H8Z" fill="currentColor"/>
                <path d="M22 16V22H16V16H22Z" fill="currentColor"/>
              </svg>
              <span>{ticket.date}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && filteredTickets.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            Next
          </button>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default TicketList;
