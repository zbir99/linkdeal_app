import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * A wrapper component that protects routes from unauthenticated access.
 * Redirects to login page if user is not authenticated.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        // Redirect to login page, but save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
