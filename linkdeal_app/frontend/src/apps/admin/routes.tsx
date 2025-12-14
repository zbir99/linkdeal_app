import { RouteObject } from 'react-router-dom';
import { AdminDashboard } from './pages/Dashboard';
import MentorListPage from './pages/Mentor_list';
import Validation from './pages/Validation';
import SupportTickets from './pages/Support_tickets';
import UserManagement from './pages/User_Management';
import Settings from './pages/Settings';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';

// Admin App Routes - Protected for admin and super_admin roles only
export const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></RoleProtectedRoute>
    },
    {
        path: '/admin/mentors',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><MentorListPage /></RoleProtectedRoute>
    },
    {
        path: '/admin/validation',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><Validation /></RoleProtectedRoute>
    },
    {
        path: '/admin/support-tickets',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><SupportTickets /></RoleProtectedRoute>
    },
    {
        path: '/admin/user-management',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><UserManagement /></RoleProtectedRoute>
    },
    {
        path: '/admin/settings',
        element: <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><Settings /></RoleProtectedRoute>
    }
];
