import { RouteObject } from 'react-router-dom';
import { AdminDashboard } from './pages/Dashboard';
import MentorListPage from './pages/Mentor_list';
import Validation from './pages/Validation';
import SupportTickets from './pages/Support_tickets';
import UserManagement from './pages/User_Management';
import Settings from './pages/Settings';

// Admin App Routes
export const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: <AdminDashboard />
    },
    {
        path: '/admin/mentors',
        element: <MentorListPage />
    },
    {
        path: '/admin/validation',
        element: <Validation />
    },
    {
        path: '/admin/support-tickets',
        element: <SupportTickets />
    },
    {
        path: '/admin/user-management',
        element: <UserManagement />
    },
    {
        path: '/admin/settings',
        element: <Settings />
    }
];
