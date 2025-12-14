import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseNavigationGuardOptions {
    /** Whether the guard is active (e.g., form has unsaved changes) */
    when: boolean;
    /** Message to show in the modal */
    message?: string;
    /** Paths that are allowed without triggering the warning (e.g., next steps in a flow) */
    allowedPaths?: string[];
}

interface NavigationGuardResult {
    /** Whether the unsaved changes modal is visible */
    showModal: boolean;
    /** Close the modal and stay on page */
    handleStayOnPage: () => void;
    /** Close the modal and navigate away */
    handleLeaveAnyway: () => void;
    /** The pending navigation path (if any) */
    pendingPath: string | null;
}

/**
 * Custom hook to guard against accidental navigation when there are unsaved changes.
 * 
 * Features:
 * - Shows browser's native "Leave site?" dialog on browser close/refresh
 * - Intercepts internal navigation and shows a custom modal
 * - Provides handlers for "Stay on Page" and "Leave Anyway" actions
 * - Allows certain paths (like next steps) without warning
 */
export function useNavigationGuard({
    when,
    message: _message,
    allowedPaths = []
}: UseNavigationGuardOptions): NavigationGuardResult {
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    // Handle browser close/refresh (beforeunload event)
    useEffect(() => {
        if (!when) {
            console.log('[NavigationGuard] Guard inactive - no unsaved changes');
            return;
        }

        console.log('[NavigationGuard] Guard ACTIVE - will warn on close/refresh');

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            console.log('[NavigationGuard] beforeunload triggered!');
            // Cancel the event - this is required for the prompt to show
            e.preventDefault();
            // Chrome requires returnValue to be set (legacy)
            // The actual message is ignored by modern browsers, they show their own
            const message = 'You have unsaved changes. Are you sure you want to leave?';
            e.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('[NavigationGuard] Cleanup - removing beforeunload listener');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [when]);

    // Intercept internal navigation by overriding pushState and replaceState
    useEffect(() => {
        if (!when) return;

        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        const isPathAllowed = (pathname: string): boolean => {
            // Check if the path is in the allowed list
            return allowedPaths.some(allowed => {
                // Support both exact matches and prefix matches (for paths ending with *)
                if (allowed.endsWith('*')) {
                    return pathname.startsWith(allowed.slice(0, -1));
                }
                return pathname === allowed;
            });
        };

        const interceptNavigation = (url: string | URL | null | undefined) => {
            if (url && typeof url === 'string') {
                // Extract pathname from the URL
                const pathname = url.startsWith('/') ? url : new URL(url, window.location.origin).pathname;

                // Check if navigating away from current page
                if (pathname !== location.pathname) {
                    // Allow navigation to whitelisted paths without warning
                    if (isPathAllowed(pathname)) {
                        console.log('[NavigationGuard] Allowing navigation to:', pathname);
                        return false; // Don't block
                    }

                    console.log('[NavigationGuard] Blocking navigation to:', pathname);
                    setPendingPath(pathname);
                    setShowModal(true);
                    return true; // Block navigation
                }
            }
            return false;
        };

        window.history.pushState = function (...args) {
            const url = args[2];
            if (!interceptNavigation(url)) {
                return originalPushState.apply(this, args);
            }
        };

        window.history.replaceState = function (...args) {
            const url = args[2];
            if (!interceptNavigation(url)) {
                return originalReplaceState.apply(this, args);
            }
        };

        // Handle back/forward buttons
        const handlePopState = () => {
            if (when) {
                // Push the current state back to prevent navigation
                window.history.pushState(null, '', location.pathname);
                setPendingPath('back');
                setShowModal(true);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', handlePopState);
        };
    }, [when, location.pathname, allowedPaths]);

    const handleStayOnPage = useCallback(() => {
        setShowModal(false);
        setPendingPath(null);
    }, []);

    const handleLeaveAnyway = useCallback(() => {
        setShowModal(false);

        if (pendingPath === 'back') {
            // Go back in history
            window.history.go(-2); // -2 because we pushed a state in popstate handler
        } else if (pendingPath) {
            // Navigate to the pending path
            navigate(pendingPath, { replace: true });
        }

        setPendingPath(null);
    }, [pendingPath, navigate]);

    return {
        showModal,
        handleStayOnPage,
        handleLeaveAnyway,
        pendingPath,
    };
}

export default useNavigationGuard;
