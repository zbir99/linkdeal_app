from django.contrib import admin
from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'recipient', 'notification_type', 'is_read', 'email_sent', 'created_at']
    list_filter = ['notification_type', 'is_read', 'email_sent', 'created_at']
    search_fields = ['title', 'message', 'recipient__email']
    readonly_fields = ['id', 'created_at', 'read_at', 'email_sent_at']
    ordering = ['-created_at']
