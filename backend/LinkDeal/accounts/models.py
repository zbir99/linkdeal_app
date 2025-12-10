from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import uuid
import os
import logging
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
    field_of_study = models.CharField(max_length=255)
    country = models.CharField(max_length=100)

    profile_picture = models.ImageField(
        upload_to=mentee_profile_picture_upload_path,
        null=True,
        blank=True,
        validators=[
            FileSizeValidator(5),
            FileExtensionValidator(["jpg", "jpeg", "png"])
        ]
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
