/**
 * useNotifications Hook
 * Manages notification state including unread count
 */
import { useState, useEffect, useCallback } from 'react';
import notificationsService, { Notification } from '@/services/notifications';

interface UseNotificationsOptions {
    autoRefresh?: boolean; // Auto-refresh every 30 seconds
    unreadOnly?: boolean;
    type?: string;
}

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearReadNotifications: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
    const { autoRefresh = true, unreadOnly = false, type } = options;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setError(null);
            const data = await notificationsService.getNotifications({ unreadOnly, type });
            setNotifications(data);
        } catch (err: any) {
            console.error('Error fetching notifications:', err);
            setError(err.message || 'Failed to fetch notifications');
        }
    }, [unreadOnly, type]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationsService.getUnreadCount();
            setUnreadCount(count);
        } catch (err: any) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    // Combined refresh function
    const refresh = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        setIsLoading(false);
    }, [fetchNotifications, fetchUnreadCount]);

    // Mark single notification as read
    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationsService.markAsRead(id);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err: any) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationsService.markAllAsRead();

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err: any) {
            console.error('Error marking all as read:', err);
            throw err;
        }
    }, []);

    // Delete a notification
    const deleteNotification = useCallback(async (id: string) => {
        try {
            const notification = notifications.find(n => n.id === id);
            await notificationsService.deleteNotification(id);

            // Update local state
            setNotifications(prev => prev.filter(n => n.id !== id));

            // Update unread count if the deleted notification was unread
            if (notification && !notification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err: any) {
            console.error('Error deleting notification:', err);
            throw err;
        }
    }, [notifications]);

    // Clear all read notifications
    const clearReadNotifications = useCallback(async () => {
        try {
            await notificationsService.clearReadNotifications();

            // Update local state - keep only unread
            setNotifications(prev => prev.filter(n => !n.is_read));
        } catch (err: any) {
            console.error('Error clearing read notifications:', err);
            throw err;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Auto-refresh every 30 seconds if enabled
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchUnreadCount(); // Just refresh the count, not the full list
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        refresh,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
    };
}

/**
 * useUnreadCount Hook
 * Lighter hook that only fetches the unread count - useful for header badge
 */
export function useUnreadCount(autoRefresh = true): { count: number; refresh: () => Promise<void> } {
    const [count, setCount] = useState(0);

    const refresh = useCallback(async () => {
        try {
            const unreadCount = await notificationsService.getUnreadCount();
            setCount(unreadCount);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(refresh, 30000);
        return () => clearInterval(interval);
    }, [autoRefresh, refresh]);

    return { count, refresh };
}

export default useNotifications;
