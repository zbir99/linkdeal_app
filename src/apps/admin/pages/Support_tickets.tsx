import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupportHeader from '../components/support_tickets/SupportHeader';
import SupportFilters from '../components/support_tickets/SupportFilters';
import TicketList from '../components/support_tickets/TicketList';
import TicketDetails from '../components/support_tickets/TicketDetails';

const SupportTickets: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('All Status');
  };

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects - Fixed to viewport */}
      <div className="fixed top-[-110px] left-[-24px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
      <div className="fixed top-[1119px] left-[527px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      
      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed top-[428px] left-[-46px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />
      <div className="fixed top-[751px] left-[164px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-purple-500/40 to-blue-500/40 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-8">
          {/* Header */}
          <SupportHeader onBackToDashboard={handleBackToDashboard} />

          {/* Filters */}
          <SupportFilters 
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Ticket List */}
            <TicketList 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onClearSearch={handleClearSearch}
              onTicketSelect={handleTicketSelect}
              selectedTicketId={selectedTicket?.id || null}
            />

            {/* Ticket Details */}
            <TicketDetails ticket={selectedTicket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;