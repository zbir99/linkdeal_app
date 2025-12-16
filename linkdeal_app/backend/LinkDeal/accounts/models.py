from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
import uuid
import os
import logging
import secrets
from accounts.validators import FileSizeValidator, FileExtensionValidator

logger = logging.getLogger(__name__)


def mentee_profile_picture_upload_path(instance: "MenteeProfile", filename: str) -> str:
    """
    Store mentee pictures under:
    media/mentees/<app_user_id>/profile_picture/<filename>
    """
    # instance.user is the AppUser
    user_id = instance.user_id or "unknown"
    return f"mentees/{user_id}/profile_picture/{filename}"


def mentor_profile_picture_upload_path(instance: "MentorProfile", filename: str) -> str:
    user_id = instance.user_id or "unknown"
    return f"mentors/{user_id}/profile_picture/{filename}"


def mentor_cv_upload_path(instance: "MentorProfile", filename: str) -> str:
    user_id = instance.user_id or "unknown"
    return f"mentors/{user_id}/cv/{filename}"


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name



# -------------------------------------------------------------------
# 1. PLATFORM USER MODEL
# -------------------------------------------------------------------

class AppUser(models.Model):
    """
    Local representation of a user authenticated via Auth0.
    Stores only platform-specific data that Auth0 does not manage.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    auth0_id = models.CharField(
        max_length=200,
        unique=True,
        help_text="The user_id returned by Auth0 (e.g. auth0|abcd1234)"
    )

    email = models.EmailField(
        unique=True,
        help_text="Email stored locally for quick lookup & linking to profiles."
    )

    # Roles handled in Auth0 as well, but kept locally for DB-level filtering
    role = models.CharField(
        max_length=20,
        choices=[
            ("super_admin", "Super Admin"),
            ("admin", "Admin"),
            ("mentor", "Mentor"),
            ("mentee", "Mentee"),
        ]
    )

    # Admin invitation tracking
    invited_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invited_users",
        help_text="The super_admin who invited this user (null if created outside the flow)"
    )

    invited_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When this user was invited (null if created outside the flow)"
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("invited", "Invited"),
            ("active", "Active"),
        ],
        default="active",
        help_text="User status: invited (password not set yet) or active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} ({self.role})"



# -------------------------------------------------------------------
# 2. MENTOR PROFILE MODEL
# -------------------------------------------------------------------

class MentorProfile(models.Model):
    """
    Stores all mentor-specific onboarding details.
    This is created AFTER AppUser is created.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        AppUser,
        on_delete=models.CASCADE,
        related_name="mentor_profile"
    )

    # YOU REQUESTED THIS → explicit email on mentor profile as well
    email = models.EmailField(help_text="Mentor email (duplicate for UI convenience).")

    full_name = models.CharField(max_length=255)
    professional_title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    linkedin_url = models.URLField()
    bio = models.TextField()
    languages = models.CharField(max_length=255)
    country = models.CharField(max_length=100)

    profile_picture = models.ImageField(
        upload_to=mentor_profile_picture_upload_path,
        null=True,
        blank=True,
        validators=[
            FileSizeValidator(5),  # 5 MB
            FileExtensionValidator(["jpg", "jpeg", "png"])
        ]
    )

    cv = models.FileField(
        upload_to=mentor_cv_upload_path,
        validators=[
            FileSizeValidator(10),  # 10 MB
            FileExtensionValidator(["pdf"])
        ]
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
            ("banned", "Banned"),
        ],
        default="pending"
    )

    skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of skills (e.g., ['Python', 'Django', 'Machine Learning'])"
    )

    # Ban metadata (audit)
    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the mentor was banned (if applicable)."
    )
    banned_by = models.ForeignKey(
        AppUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="banned_mentors",
        help_text="Admin/Super Admin who performed the ban."
    )
    ban_reason = models.TextField(
        null=True,
        blank=True,
        help_text="Reason provided when banning the mentor (optional)."
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"MentorProfile({self.full_name} - {self.status})"


@receiver(post_delete, sender=MentorProfile)
def delete_mentor_files(sender, instance, **kwargs):
    """
    Delete uploaded files when MentorProfile is deleted.
    This ensures files are removed from the filesystem.
    """
    # Delete profile picture if it exists
    if instance.profile_picture:
        try:
            if os.path.isfile(instance.profile_picture.path):
                os.remove(instance.profile_picture.path)
                logger.info(f"Deleted mentor profile picture: {instance.profile_picture.path}")
        except Exception as e:
            # Log error but don't fail deletion
            logger.error(f"Error deleting mentor profile picture {instance.profile_picture.path}: {e}")
    
    # Delete CV if it exists
    if instance.cv:
        try:
            if os.path.isfile(instance.cv.path):
                os.remove(instance.cv.path)
                logger.info(f"Deleted mentor CV: {instance.cv.path}")
        except Exception as e:
            logger.error(f"Error deleting mentor CV {instance.cv.path}: {e}")



# -------------------------------------------------------------------
# 3. MENTEE PROFILE MODEL
# -------------------------------------------------------------------

class MenteeProfile(models.Model):
    """
    Stores mentee-specific onboarding details.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        AppUser,
        on_delete=models.CASCADE,
        related_name="mentee_profile"
    )

    full_name = models.CharField(max_length=255)
    email = models.EmailField(help_text="Duplicate email for UI convenience.")
    field_of_study = models.CharField(max_length=255, blank=True, default="")
    country = models.CharField(max_length=100)
    language = models.CharField(max_length=255, blank=True, default="", help_text="Preferred language(s)")

    profile_picture = models.ImageField(
        upload_to=mentee_profile_picture_upload_path,
        null=True,
        blank=True,
        validators=[
            FileSizeValidator(5),
            FileExtensionValidator(["jpg", "jpeg", "png"])
        ]
    )
    
    # For social auth (Google/LinkedIn) profile pictures
    social_picture_url = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        help_text="Profile picture URL from social auth (Google/LinkedIn)"
    )

    # NEW FIELDS FROM UI
    interests = models.JSONField(
        default=list,
        blank=True,
        help_text="List of selected interests (e.g., ['Web Development', 'AI/ML', 'Data Science'])"
    )
    
    user_type = models.CharField(
        max_length=50,
        choices=[
            ("student", "Student"),
            ("professional", "Professional"),
            ("entrepreneur", "Entrepreneur"),
            ("career_changer", "Career Changer"),
            ("job_seeker", "Job Seeker"),
        ],
        null=True,
        blank=True,
        help_text="Type of user (Student, Professional, Entrepreneur, Career Changer, Job Seeker)"
    )
    
    session_frequency = models.CharField(
        max_length=50,
        choices=[
            ("once_week", "Once a week"),
            ("every_two_weeks", "Every two weeks"),
            ("once_month", "Once a month"),
            ("flexible", "Flexible"),
        ],
        null=True,
        blank=True,
        help_text="Preferred session frequency"
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("active", "Active"),
            ("banned", "Banned"),
        ],
        default="active",
        help_text="Mentee account status for access control."
    )

    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the mentee was banned (if applicable)."
    )
    banned_by = models.ForeignKey(
        AppUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="banned_mentees",
        help_text="Admin/Super Admin who performed the ban."
    )
    ban_reason = models.TextField(
        null=True,
        blank=True,
        help_text="Reason provided when banning the mentee (optional)."
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"MenteeProfile({self.full_name})"


@receiver(post_delete, sender=MenteeProfile)
def delete_mentee_files(sender, instance, **kwargs):
    """
    Delete uploaded files when MenteeProfile is deleted.
    This ensures files are removed from the filesystem.
    """
    # Delete profile picture if it exists
    if instance.profile_picture:
        try:
            if os.path.isfile(instance.profile_picture.path):
                os.remove(instance.profile_picture.path)
                logger.info(f"Deleted mentee profile picture: {instance.profile_picture.path}")
        except Exception as e:
            # Log error but don't fail deletion
            logger.error(f"Error deleting mentee profile picture {instance.profile_picture.path}: {e}")


# -------------------------------------------------------------------
# 4. ACCOUNT LINKING VERIFICATION MODEL
# -------------------------------------------------------------------

class AccountLinkingVerification(models.Model):
    """
    Stores verification tokens for linking social accounts to existing accounts.
    Used when a user tries to register with Google/LinkedIn but an account
    with the same email already exists.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # The existing user's account (the one being linked TO)
    existing_user = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="linking_verifications"
    )
    
    # The new social account trying to register
    new_auth0_id = models.CharField(
        max_length=200,
        help_text="The Auth0 ID of the new social account (e.g., google-oauth2|123)"
    )
    new_email = models.EmailField(
        help_text="Email of the new social account (should match existing_user.email)"
    )
    
    # Verification token
    token = models.CharField(
        max_length=64,
        unique=True,
        help_text="Cryptographically secure token for verification"
    )
    
    # Status
    verified = models.BooleanField(
        default=False,
        help_text="Whether this verification has been completed"
    )
    expired = models.BooleanField(
        default=False,
        help_text="Whether this verification has expired"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(
        help_text="When this verification token expires (default: 15 minutes)"
    )
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the verification was completed"
    )
    
    # Registration data (stored temporarily until verification)
    registration_data = models.JSONField(
        help_text="Stores profile data (full_name, field_of_study, etc.) until verification"
    )
    role = models.CharField(
        max_length=20,
        choices=[
            ("mentor", "Mentor"),
            ("mentee", "Mentee"),
        ],
        help_text="Role chosen during registration"
    )
    
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["expires_at"]),
        ]
    
    def __str__(self):
        return f"AccountLinkingVerification({self.existing_user.email} -> {self.new_auth0_id})"
    
    def save(self, *args, **kwargs):
        # Auto-generate token if not provided
        if not self.token:
            self.token = secrets.token_urlsafe(48)  # 64 chars when URL-safe encoded
        
        # Auto-set expiration if not provided (15 minutes from now)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if the verification token has expired."""
        return timezone.now() > self.expires_at
    
    def mark_as_expired(self):
        """Mark this verification as expired."""
        self.expired = True
        self.save(update_fields=["expired"])
    
    def verify(self):
        """Mark this verification as completed."""
        if self.verified:
            return False  # Already verified
        if self.is_expired():
            self.mark_as_expired()
            return False  # Expired
        
        self.verified = True
        self.verified_at = timezone.now()
        self.save(update_fields=["verified", "verified_at"])
        return True


# -------------------------------------------------------------------
# 5. EMAIL VERIFICATION TOKEN MODEL
# -------------------------------------------------------------------

class EmailVerificationToken(models.Model):
    """
    Stores tokens for email verification.
    Tokens expire after 24 hours.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens"
    )
    
    token = models.CharField(
        max_length=64,
        unique=True,
        help_text="Cryptographically secure verification token"
    )
    
    expires_at = models.DateTimeField(
        help_text="When this token expires (default: 24 hours)"
    )
    
    verified = models.BooleanField(
        default=False,
        help_text="Whether the email has been verified with this token"
    )
    
    verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the email was verified"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["expires_at"]),
        ]
    
    def __str__(self):
        return f"EmailVerificationToken({self.user.email})"
    
    def save(self, *args, **kwargs):
        # Auto-generate token if not provided
        if not self.token:
            self.token = secrets.token_urlsafe(48)
        
        # Auto-set expiration if not provided (24 hours from now)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if the verification token has expired."""
        return timezone.now() > self.expires_at
    
    def verify(self):
        """Mark the email as verified."""
        if self.verified:
            return False  # Already verified
        if self.is_expired():
            return False  # Expired
        
        self.verified = True
        self.verified_at = timezone.now()
        self.save(update_fields=["verified", "verified_at"])
        return True


# -------------------------------------------------------------------
# 6. PASSWORD RESET TOKEN MODEL
# -------------------------------------------------------------------

class PasswordResetToken(models.Model):
    """
    Stores tokens for password reset.
    Tokens expire after 1 hour.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    email = models.EmailField(
        help_text="Email address for password reset"
    )
    
    auth0_user_id = models.CharField(
        max_length=200,
        help_text="Auth0 user ID for updating password"
    )
    
    token = models.CharField(
        max_length=64,
        unique=True,
        help_text="Cryptographically secure reset token"
    )
    
    expires_at = models.DateTimeField(
        help_text="When this token expires (default: 1 hour)"
    )
    
    used = models.BooleanField(
        default=False,
        help_text="Whether this token has been used"
    )
    
    used_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the token was used"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["expires_at"]),
            models.Index(fields=["email"]),
        ]
    
    def __str__(self):
        return f"PasswordResetToken({self.email})"
    
    def save(self, *args, **kwargs):
        # Auto-generate token if not provided
        if not self.token:
            self.token = secrets.token_urlsafe(48)
        
        # Auto-set expiration if not provided (1 hour from now)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)
        
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if the reset token has expired."""
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Check if the token is valid (not expired and not used)."""
        return not self.is_expired() and not self.used
    
    def mark_as_used(self):
        """Mark the token as used."""
        if self.used:
            return False  # Already used
        if self.is_expired():
            return False  # Expired
        
        self.used = True
        self.used_at = timezone.now()
        self.save(update_fields=["used", "used_at"])
        return True
