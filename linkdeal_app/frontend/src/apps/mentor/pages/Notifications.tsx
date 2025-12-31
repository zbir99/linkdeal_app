import { FunctionComponent, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationHeader from '../components/notifications/NotificationHeader';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationList from '../components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications: FunctionComponent = () => {
  const navigate = useNavigate();
  const [markAllReadTrigger, setMarkAllReadTrigger] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  // Use the notifications hook to get unread count
  const { unreadCount, isLoading, markAllAsRead } = useNotifications();

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setMarkAllReadTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [markAllAsRead]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      <div className="hidden md:block">
        <div className="fixed top-[-216px] left-[204.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[497px] left-[145.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[28px] left-[637.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <NotificationHeader
            onBack={handleBack}
            onMarkAllRead={handleMarkAllRead}
            unreadCount={unreadCount}
            isLoading={isLoading}
          />
          <NotificationFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <NotificationList markAllReadTrigger={markAllReadTrigger} activeFilter={activeFilter} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;

