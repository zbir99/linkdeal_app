"""
Notification models for LinkDeal platform.
Handles in-app notifications for users.
"""
from django.db import models
import uuid


class Notification(models.Model):
    """
    In-app notification for a user.
    Used for session reminders, booking confirmations, etc.
    """
    TYPE_CHOICES = [
        ('session_reminder', 'Session Reminder'),
        ('session_confirmed', 'Session Confirmed'),
        ('session_cancelled', 'Session Cancelled'),
        ('session_completed', 'Session Completed'),
        ('new_booking', 'New Booking'),
        ('new_review', 'New Review'),
        ('payment_received', 'Payment Received'),
        ('profile_approved', 'Profile Approved'),
        ('general', 'General'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Recipient
    recipient = models.ForeignKey(
        'accounts.AppUser',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    # Notification content
    notification_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default='general'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Optional link (e.g., video room URL, session details page)
    link = models.URLField(max_length=1000, blank=True)
    link_text = models.CharField(max_length=100, blank=True, default="Voir détails")
    
    # Related session (optional, for session-related notifications)
    related_session = models.ForeignKey(
        'scheduling.Session',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Email tracking
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        status = "✓" if self.is_read else "○"
        return f"{status} {self.title} → {self.recipient.email}"

    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            from django.utils import timezone
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
