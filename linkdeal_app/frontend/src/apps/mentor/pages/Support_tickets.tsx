import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketsHeader } from '../components/support_tickets/TicketsHeader';
import { TicketsFilters } from '../components/support_tickets/TicketsFilters';
import { TicketsList } from '../components/support_tickets/TicketsList';
import { TicketDetails } from '../components/support_tickets/TicketDetails';

export interface Ticket {
  id: string;
  subject: string;
  userName: string;
  userType: 'mentee' | 'mentor';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  category: string;
  message: string;
  date: string;
}

const Support_tickets: FunctionComponent = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a1a,#1a1a2e_50%,#2a1a3e)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[300px] left-[500px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-600/40 to-blue-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <TicketsHeader onBack={handleBack} />
        
        <div className="space-y-6">
          <TicketsFilters 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TicketsList 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              onClearFilters={handleClearFilters}
            />
            <TicketDetails ticket={selectedTicket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support_tickets;

