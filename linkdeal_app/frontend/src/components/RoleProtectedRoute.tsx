import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth';
import { ReactNode } from 'react';

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

/**
 * A wrapper component that protects routes based on user role.
 * Redirects to login if not authenticated, or to appropriate dashboard if role not allowed.
 * 
 * @param allowedRoles - Array of roles that can access this route (e.g., ['admin', 'super_admin'])
 */
export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get current user and check role
    const user = authService.getUser();

    if (!user || !user.role) {
        // No user data or role - logout and redirect to login
        authService.logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user.role)) {
        // Role not allowed - redirect based on their actual role
        switch (user.role) {
            case 'mentee':
                return <Navigate to="/mentee/dashboard" replace />;
            case 'mentor':
                return <Navigate to="/mentor/dashboard" replace />;
            default:
                // Unknown role - redirect to home
                return <Navigate to="/" replace />;
        }
    }

    // Authenticated and authorized - render children
    return <>{children}</>;
};

export default RoleProtectedRoute;
