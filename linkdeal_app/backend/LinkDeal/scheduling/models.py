"""
Scheduling models for LinkDeal platform.
Handles mentor availability, sessions, and video calls.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


# -------------------------------------------------------------------
# 1. SESSION TYPE MODEL
# -------------------------------------------------------------------

class SessionType(models.Model):
    """
    Types of sessions available (One-on-One, Group, Quick Call, etc.)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    default_duration = models.IntegerField(
        default=60,
        validators=[MinValueValidator(15), MaxValueValidator(480)],
        help_text="Default duration in minutes"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.default_duration} min)"


# -------------------------------------------------------------------
# 2. MENTOR AVAILABILITY MODEL
# -------------------------------------------------------------------

class MentorAvailability(models.Model):
    """
    Time slots when a mentor is available for sessions.
    Can be recurring (weekly) or for a specific date.
    """
    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='availabilities'
    )
    day_of_week = models.IntegerField(
        choices=DAY_CHOICES,
        help_text="Day of week (0=Monday, 6=Sunday)"
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_recurring = models.BooleanField(
        default=True,
        help_text="If True, repeats every week. If False, specific_date is required."
    )
    specific_date = models.DateField(
        null=True,
        blank=True,
        help_text="For non-recurring slots, the specific date"
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Can be set to False to temporarily disable a slot"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']
        verbose_name_plural = "Mentor availabilities"

    def __str__(self):
        day = self.get_day_of_week_display()
        return f"{self.mentor.full_name} - {day} {self.start_time}-{self.end_time}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time")
        if not self.is_recurring and not self.specific_date:
            raise ValidationError("Non-recurring slots require a specific date")


# -------------------------------------------------------------------
# 3. SESSION MODEL
# -------------------------------------------------------------------

class Session(models.Model):
    """
    A mentoring session between a mentor and mentee.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    VIDEO_PROVIDERS = [
        ('jitsi', 'Jitsi Meet'),
        ('twilio', 'Twilio Video'),
        ('daily', 'Daily.co'),
        ('zoom', 'Zoom'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Participants
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='mentor_sessions'
    )
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='mentee_sessions'
    )
    
    # Session details
    session_type = models.ForeignKey(
        SessionType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sessions'
    )
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(
        default=60,
        validators=[MinValueValidator(15), MaxValueValidator(480)]
    )
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Notes and objectives
    mentee_notes = models.TextField(
        blank=True,
        help_text="Notes from mentee before/during session"
    )
    mentor_notes = models.TextField(
        blank=True,
        help_text="Notes from mentor after session"
    )
    objectives = models.JSONField(
        default=list,
        blank=True,
        help_text="List of session objectives"
    )
    
    # Video call
    video_room_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Unique room ID for video call"
    )
    video_provider = models.CharField(
        max_length=20,
        choices=VIDEO_PROVIDERS,
        default='jitsi'
    )
    call_started_at = models.DateTimeField(null=True, blank=True)
    call_ended_at = models.DateTimeField(null=True, blank=True)
    
    # Cancellation
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(
        'accounts.AppUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cancelled_sessions'
    )
    cancellation_reason = models.TextField(blank=True)
    
    # Payment reference (will link to billing app)
    payment_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Reference to payment in billing system"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"Session: {self.mentor.full_name} with {self.mentee.full_name} on {self.scheduled_at}"

    @property
    def end_time(self):
        """Calculate session end time"""
        from datetime import timedelta
        return self.scheduled_at + timedelta(minutes=self.duration_minutes)

    @property
    def is_upcoming(self):
        """Check if session is in the future"""
        return self.scheduled_at > timezone.now() and self.status in ['pending', 'confirmed']

    @property
    def is_past(self):
        """Check if session has already occurred"""
        return self.scheduled_at < timezone.now()

    def generate_video_room_id(self):
        """Generate a unique video room ID"""
        if not self.video_room_id:
            self.video_room_id = f"linkdeal-{self.id.hex[:12]}"
        return self.video_room_id


# -------------------------------------------------------------------
# 4. SESSION ATTACHMENT MODEL
# -------------------------------------------------------------------

def session_attachment_path(instance, filename):
    """Upload path for session attachments"""
    return f"sessions/{instance.session_id}/attachments/{filename}"


class SessionAttachment(models.Model):
    """
    Files attached to a session (documents, images, etc.)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    uploaded_by = models.ForeignKey(
        'accounts.AppUser',
        on_delete=models.CASCADE,
        related_name='session_attachments'
    )
    file = models.FileField(upload_to=session_attachment_path)
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField(help_text="File size in bytes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} - {self.session}"

    def save(self, *args, **kwargs):
        if self.file and not self.filename:
            self.filename = self.file.name
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
