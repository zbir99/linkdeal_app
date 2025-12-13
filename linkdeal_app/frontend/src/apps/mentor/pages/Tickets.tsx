import { FunctionComponent } from 'react';
import { TicketForm } from '../components/tickets';

const Tickets: FunctionComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-6 w-72 h-72 rounded-full bg-[#8033d0] opacity-20 blur-[160px]" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#0a203b] opacity-40 blur-[160px]" />
      </div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-10">
        <TicketForm />
      </div>
    </div>
  );
};

export default Tickets;