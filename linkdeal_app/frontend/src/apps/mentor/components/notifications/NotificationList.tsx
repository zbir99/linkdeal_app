import { FunctionComponent, useState, useEffect } from 'react';
import notificationsService, { Notification } from '@/services/notifications';

interface NotificationListProps {
  markAllReadTrigger?: number;
}

const NotificationList: FunctionComponent<NotificationListProps> = ({ markAllReadTrigger }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 4;

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Échec du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all as read when triggered from parent
  useEffect(() => {
    if (markAllReadTrigger && markAllReadTrigger > 0) {
      handleMarkAllRead();
    }
  }, [markAllReadTrigger]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationsService.deleteNotification(id);
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);

      const totalPages = Math.ceil(updatedNotifications.length / notificationsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Map notification_type to display type
  const mapNotificationType = (type: string): 'message' | 'booking' | 'achievement' | 'reminder' | 'payment' => {
    switch (type) {
      case 'session_reminder':
        return 'reminder';
      case 'session_confirmed':
      case 'new_booking':
        return 'booking';
      case 'payment_received':
        return 'payment';
      case 'new_review':
        return 'achievement';
      default:
        return 'message';
    }
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getNotificationIcon = (type: string) => {
    const displayType = mapNotificationType(type);

    switch (displayType) {
      case 'message':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#7008E7" fillOpacity="0.2" />
            <path d="M34 29C34 29.5304 33.7893 30.0391 33.4142 30.4142C33.0391 30.7893 32.5304 31 32 31H18.828C18.2976 31.0001 17.789 31.2109 17.414 31.586L15.212 33.788C15.1127 33.8873 14.9862 33.9549 14.8485 33.9823C14.7108 34.0097 14.568 33.9956 14.4383 33.9419C14.3086 33.8881 14.1977 33.7971 14.1197 33.6804C14.0417 33.5637 14 33.4264 14 33.286V17C14 16.4696 14.2107 15.9609 14.5858 15.5858C14.9609 15.2107 15.4696 15 16 15H32C32.5304 15 33.0391 15.2107 33.4142 15.5858C33.7893 15.9609 34 16.4696 34 17V29Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'booking':
      case 'reminder':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#2B7FFF" fillOpacity="0.2" />
            <path d="M20 14V18" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 14V18" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 16H17C15.8954 16 15 16.8954 15 18V32C15 33.1046 15.8954 34 17 34H31C32.1046 34 33 33.1046 33 32V18C33 16.8954 32.1046 16 31 16Z" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 22H33" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'achievement':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#FF6900" fillOpacity="0.2" />
            <path d="M27.4768 24.8901L28.9918 33.4161C29.0087 33.5165 28.9946 33.6197 28.9514 33.7119C28.9081 33.8041 28.8377 33.8808 28.7497 33.9319C28.6616 33.983 28.56 34.006 28.4586 33.9978C28.3571 33.9897 28.2605 33.9507 28.1818 33.8861L24.6018 31.1991C24.4289 31.07 24.219 31.0003 24.0033 31.0003C23.7875 31.0003 23.5776 31.07 23.4048 31.1991L19.8188 33.8851C19.7401 33.9496 19.6436 33.9885 19.5422 33.9967C19.4409 34.0049 19.3394 33.982 19.2514 33.931C19.1634 33.88 19.093 33.8035 19.0497 33.7115C19.0063 33.6195 18.992 33.5165 19.0088 33.4161L20.5228 24.8901" stroke="#FF8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 26C27.3137 26 30 23.3137 30 20C30 16.6863 27.3137 14 24 14C20.6863 14 18 16.6863 18 20C18 23.3137 20.6863 26 24 26Z" stroke="#FF8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'payment':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#00C950" fillOpacity="0.2" />
            <path d="M24 14V34" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M29 17H21.5C20.5717 17 19.6815 17.3687 19.0251 18.0251C18.3687 18.6815 18 19.5717 18 20.5C18 21.4283 18.3687 22.3185 19.0251 22.9749C19.6815 23.6313 20.5717 24 21.5 24H26.5C27.4283 24 28.3185 24.3687 28.9749 25.0251C29.6313 25.6815 30 26.5717 30 27.5C30 28.4283 29.6313 29.3185 28.9749 29.9749C28.3185 30.6313 27.4283 31 26.5 31H18" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-xl text-white font-medium mb-2">Erreur de chargement</h3>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6914 28C13.9255 28.4054 14.2621 28.742 14.6675 28.976C15.0728 29.21 15.5327 29.3332 16.0007 29.3332C16.4688 29.3332 16.9286 29.21 17.334 28.976C17.7394 28.742 18.076 28.4054 18.3101 28" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.35031 20.4345C4.17613 20.6254 4.06118 20.8628 4.01945 21.1179C3.97772 21.3729 4.011 21.6346 4.11525 21.871C4.2195 22.1075 4.39023 22.3086 4.60665 22.4498C4.82308 22.591 5.07588 22.6663 5.33431 22.6665H26.6676C26.926 22.6666 27.1789 22.5916 27.3955 22.4506C27.612 22.3097 27.783 22.1088 27.8875 21.8725C27.992 21.6362 28.0256 21.3746 27.9842 21.1196C27.9428 20.8645 27.8282 20.627 27.6543 20.4358C25.881 18.6078 24.001 16.6652 24.001 10.6665C24.001 8.54477 23.1581 6.50994 21.6578 5.00965C20.1575 3.50936 18.1227 2.6665 16.001 2.6665C13.8792 2.6665 11.8444 3.50936 10.3441 5.00965C8.84383 6.50994 8.00098 8.54477 8.00098 10.6665C8.00098 16.6652 6.11965 18.6078 4.35031 20.4345Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-xl text-white font-medium mb-2">Aucune notification</h3>
        <p className="text-gray-400 text-sm">Vous êtes à jour ! Aucune nouvelle notification.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentNotifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
          className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${!notification.is_read
            ? 'bg-[#7008E7]/10 border-[#7008E7]/30 hover:bg-[#7008E7]/20 hover:border-[#7008E7]/50 hover:shadow-[#7008E7]/20'
            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:shadow-white/10'
            }`}
        >
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-transparent flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.notification_type)}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-lg text-white font-inter">
                  {notification.title}
                </h3>
                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#A684FF] flex-shrink-0 mt-2 hover:scale-150 transition-all duration-300 cursor-pointer" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">
                {notification.message}
              </p>

              {/* Link button if available */}
              {notification.link && (
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white text-sm rounded-lg hover:opacity-90 transition-opacity mb-2"
                >
                  🎥 {notification.link_text || 'Rejoindre'}
                </a>
              )}

              <p className="text-gray-500 text-xs">
                {notification.time_ago}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNotification(notification.id);
              }}
              className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300 flex-shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-arimo transition-all duration-300 ${currentPage === 1
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-arimo transition-all duration-300 ${currentPage === page
                ? 'bg-[#7008E7] text-white shadow-lg shadow-[#7008E7]/30'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-arimo transition-all duration-300 ${currentPage === totalPages
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
