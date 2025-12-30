/**
 * NotificationBadge Component
 * Shows a bell icon with unread notification count
 * Can be placed in headers/navbars
 */
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useUnreadCount } from '@/hooks/useNotifications';

interface NotificationBadgeProps {
    linkTo: string; // e.g., '/mentor/notifications' or '/mentee/notifications'
    className?: string;
}

const NotificationBadge: FunctionComponent<NotificationBadgeProps> = ({ linkTo, className = '' }) => {
    const { count } = useUnreadCount();

    return (
        <Link
            to={linkTo}
            className={`relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group ${className}`}
            title={count > 0 ? `${count} notifications non lues` : 'Notifications'}
        >
            {/* Bell Icon */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 group-hover:text-white transition-colors"
            >
                <path
                    d="M10.146 21C10.3218 21.3044 10.5756 21.5565 10.8814 21.7303C11.1872 21.9041 11.5337 21.9938 11.886 21.9999C12.2384 22.006 12.588 21.9282 12.9001 21.7649C13.2121 21.6016 13.4754 21.3584 13.662 21.06"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4.00001 8.3C4.00001 6.6156 4.63215 4.99873 5.75737 3.80853C6.88259 2.61833 8.41302 1.95 10 1.95H14C15.587 1.95 17.1174 2.61833 18.2426 3.80853C19.3679 4.99873 20 6.6156 20 8.3C20 15.87 22 18.05 22 18.05H2.00001C2.00001 18.05 4.00001 14.95 4.00001 8.3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Badge avec compteur */}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-[#7008E7]/50 animate-pulse">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Link>
    );
};

export default NotificationBadge;
