import { FunctionComponent } from 'react';
import { 
  WelcomeHeader, 
  StatsCards, 
  UpcomingSessions, 
  QuickActions, 
  HistorySessions, 
  RecentPayments,
  AIChatButton
} from '../components/dashboard';

const Dashboard: FunctionComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative overflow-hidden">
      {/* Background Blur Effects - Desktop */}
      <div className="hidden md:block">
        <div className="fixed top-[-110px] left-[-24px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[985px] left-[25px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[280px] left-[259px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Background Blur Effects - Mobile */}
      <div className="md:hidden">
        <div className="absolute top-[-60px] left-[-80px] [filter:blur(96px)] rounded-full w-72 h-72 bg-gradient-to-br from-[rgba(233,212,255,0.25)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="absolute bottom-[120px] right-[-40px] [filter:blur(96px)] rounded-full w-64 h-64 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
      </div>
      
      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />

      {/* Sidebar - Quick Actions */}
      <QuickActions />

      {/* Content */}
      <div className="relative z-10 w-full pl-24 pr-4 md:pl-28 md:pr-12 py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-[2000px] mx-auto space-y-8">
          {/* Welcome Header */}
          <WelcomeHeader />

          {/* Stats Cards */}
          <StatsCards />

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HistorySessions />
            <RecentPayments />
          </div>

          {/* Upcoming Sessions */}
          <UpcomingSessions />
        </div>
      </div>

      {/* AI Chat Button - Floating */}
      <AIChatButton />
    </div>
  );
};

export default Dashboard;