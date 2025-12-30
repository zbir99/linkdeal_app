/**
 * Notifications API Service
 * Handles all notification-related API calls
 */
import api from './api';

export interface Notification {
    id: string;
    notification_type: string;
    title: string;
    message: string;
    link: string;
    link_text: string;
    session_id: string | null;
    is_read: boolean;
    read_at: string | null;
    time_ago: string;
    created_at: string;
}

export interface UnreadCountResponse {
    count: number;
}

export interface MarkReadResponse {
    success: boolean;
    message: string;
    notification?: Notification;
}

export interface MarkAllReadResponse {
    success: boolean;
    message: string;
    count: number;
}

const notificationsService = {
    /**
     * Get all notifications for the current user
     */
    async getNotifications(options?: { unreadOnly?: boolean; type?: string }): Promise<Notification[]> {
        const params = new URLSearchParams();

        if (options?.unreadOnly) {
            params.append('unread_only', 'true');
        }
        if (options?.type) {
            params.append('type', options.type);
        }

        const queryString = params.toString();
        const url = queryString ? `notifications/?${queryString}` : 'notifications/';

        const response = await api.get(url);
        return response.data;
    },

    /**
     * Get the count of unread notifications
     */
    async getUnreadCount(): Promise<number> {
        const response = await api.get<UnreadCountResponse>('notifications/unread-count/');
        return response.data.count;
    },

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: string): Promise<MarkReadResponse> {
        const response = await api.post<MarkReadResponse>(`notifications/${notificationId}/read/`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<MarkAllReadResponse> {
        const response = await api.post<MarkAllReadResponse>('notifications/read-all/');
        return response.data;
    },

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string): Promise<void> {
        await api.delete(`notifications/${notificationId}/delete/`);
    },

    /**
     * Delete all read notifications
     */
    async clearReadNotifications(): Promise<{ count: number }> {
        const response = await api.delete('notifications/clear-read/');
        return response.data;
    },

    /**
     * Get notification detail
     */
    async getNotificationDetail(notificationId: string): Promise<Notification> {
        const response = await api.get<Notification>(`notifications/${notificationId}/`);
        return response.data;
    }
};

export default notificationsService;
