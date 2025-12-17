"""
Mentoring models for LinkDeal platform.
Handles mentor-mentee relationships, reviews, favorites, and mentor categorization.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


# -------------------------------------------------------------------
# 1. MENTOR CATEGORY MODEL
# -------------------------------------------------------------------

class MentorCategory(models.Model):
    """
    Categories for mentors (Web Development, Data Science, etc.)
    Used for filtering and searching mentors.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="Icon name or class (e.g., 'code', 'chart-line')"
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories',
        help_text="Parent category for hierarchical structure"
    )
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = "Mentor categories"

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


# -------------------------------------------------------------------
# 2. MENTOR CATEGORY ASSIGNMENT MODEL
# -------------------------------------------------------------------

class MentorCategoryAssignment(models.Model):
    """
    Associates mentors with categories.
    A mentor can have multiple categories.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='category_assignments'
    )
    category = models.ForeignKey(
        MentorCategory,
        on_delete=models.CASCADE,
        related_name='mentor_assignments'
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Primary category is shown prominently on profile"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['mentor', 'category']
        ordering = ['-is_primary', 'category__name']

    def __str__(self):
        primary = "(Primary)" if self.is_primary else ""
        return f"{self.mentor.full_name} - {self.category.name} {primary}"


# -------------------------------------------------------------------
# 3. MENTOR-MENTEE RELATION MODEL
# -------------------------------------------------------------------

class MentorMenteeRelation(models.Model):
    """
    Tracks the ongoing relationship between a mentor and mentee.
    Created automatically when first session is booked.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('ended', 'Ended'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='mentee_relations'
    )
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='mentor_relations'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    
    # Statistics (updated after each session)
    total_sessions = models.IntegerField(default=0)
    completed_sessions = models.IntegerField(default=0)
    total_hours = models.DecimalField(
        max_digits=6,
        decimal_places=1,
        default=0,
        help_text="Total hours of mentoring"
    )
    
    # Notes
    mentor_notes = models.TextField(
        blank=True,
        help_text="Private notes by mentor about this mentee"
    )
    
    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    last_session_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['mentor', 'mentee']
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.mentor.full_name} <-> {self.mentee.full_name} ({self.status})"

    def update_stats(self):
        """Update statistics from completed sessions"""
        from scheduling.models import Session
        sessions = Session.objects.filter(
            mentor=self.mentor,
            mentee=self.mentee,
            status='completed'
        )
        self.completed_sessions = sessions.count()
        self.total_sessions = Session.objects.filter(
            mentor=self.mentor,
            mentee=self.mentee
        ).exclude(status='cancelled').count()
        
        # Calculate total hours
        total_minutes = sum(s.duration_minutes for s in sessions)
        self.total_hours = round(total_minutes / 60, 1)
        
        # Update last session date
        last_session = sessions.order_by('-scheduled_at').first()
        if last_session:
            self.last_session_at = last_session.scheduled_at
        
        self.save()


# -------------------------------------------------------------------
# 4. REVIEW MODEL
# -------------------------------------------------------------------

class Review(models.Model):
    """
    Review/rating left by mentee after a session.
    One review per session.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    session = models.OneToOneField(
        'scheduling.Session',
        on_delete=models.CASCADE,
        related_name='review'
    )
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='reviews_received'
    )
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    
    # Rating
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    comment = models.TextField(blank=True)
    
    # Tags for quick feedback
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text='Tags like ["professional", "helpful", "patient", "knowledgeable"]'
    )
    
    # Mentor response
    mentor_response = models.TextField(
        blank=True,
        help_text="Mentor's response to the review"
    )
    responded_at = models.DateTimeField(null=True, blank=True)
    
    # Visibility
    is_public = models.BooleanField(
        default=True,
        help_text="If False, review is only visible to mentor"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured reviews appear prominently on mentor profile"
    )
    
    # Moderation
    is_approved = models.BooleanField(
        default=True,
        help_text="Admins can hide inappropriate reviews"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review: {self.mentee.full_name} -> {self.mentor.full_name} ({self.rating}★)"


# -------------------------------------------------------------------
# 5. MENTOR FAVORITE MODEL
# -------------------------------------------------------------------

class MentorFavorite(models.Model):
    """
    Mentees can save mentors to their favorites list.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['mentee', 'mentor']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.mentee.full_name} ❤ {self.mentor.full_name}"


# -------------------------------------------------------------------
# 6. REVIEW TAG MODEL (optional - for predefined tags)
# -------------------------------------------------------------------

class ReviewTag(models.Model):
    """
    Predefined tags that mentees can select for reviews.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True)
    is_positive = models.BooleanField(
        default=True,
        help_text="Positive tags (good feedback) vs negative"
    )
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name
