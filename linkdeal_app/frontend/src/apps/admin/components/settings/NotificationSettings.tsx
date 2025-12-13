import { FunctionComponent, useState } from 'react';

interface NotificationToggle {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings: FunctionComponent = () => {
  const [notifications, setNotifications] = useState<NotificationToggle[]>([
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Send email notifications to users',
      enabled: true
    },
    {
      id: 'push-notifications',
      title: 'Push Notifications',
      description: 'Send push notifications via browser',
      enabled: true
    },
    {
      id: 'weekly-reports',
      title: 'Weekly Reports',
      description: 'Send weekly activity reports to users',
      enabled: true
    },
    {
      id: 'marketing-emails',
      title: 'Marketing Emails',
      description: 'Send promotional and marketing emails',
      enabled: false
    }
  ]);

  const handleToggle = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="p-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.55664 17.5C8.70293 17.7533 8.91332 17.9637 9.16668 18.11C9.42003 18.2563 9.70743 18.3333 9.99997 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.71772 12.7716C2.60886 12.8909 2.53702 13.0393 2.51094 13.1987C2.48486 13.3581 2.50566 13.5217 2.57081 13.6695C2.63597 13.8173 2.74267 13.9429 2.87794 14.0312C3.0132 14.1195 3.17121 14.1665 3.33272 14.1666H16.6661C16.8276 14.1667 16.9856 14.1198 17.1209 14.0317C17.2563 13.9436 17.3631 13.8181 17.4285 13.6704C17.4938 13.5227 17.5148 13.3592 17.4889 13.1998C17.4631 13.0404 17.3914 12.8919 17.2827 12.7725C16.1744 11.63 14.9994 10.4158 14.9994 6.66663C14.9994 5.34054 14.4726 4.06877 13.5349 3.13109C12.5972 2.19341 11.3255 1.66663 9.99939 1.66663C8.67331 1.66663 7.40154 2.19341 6.46386 3.13109C5.52618 4.06877 4.99939 5.34054 4.99939 6.66663C4.99939 10.4158 3.82356 11.63 2.71772 12.7716Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
        </div>

        {/* Notification Toggles */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex-1">
                <h3 className="text-white font-medium">{notification.title}</h3>
                <p className="text-white/60 text-sm mt-1">{notification.description}</p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(notification.id)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 cursor-pointer ${
                  notification.enabled 
                    ? 'bg-purple-500 hover:bg-purple-600 hover:scale-110 hover:shadow-lg shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notification.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
