import re
import logging
from rest_framework import serializers
from django.db import transaction, IntegrityError
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from accounts.models import AppUser, MentorProfile, MenteeProfile, EmailVerificationToken
from accounts.auth0_client import Auth0Client
from accounts.services import IdentityMappingService
from accounts.email_service import send_welcome_email, send_verification_email
from core.exceptions import ExternalServiceError
from rest_framework import exceptions

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------
# 1. PASSWORD VALIDATION (Strong, enterprise-level)
# ---------------------------------------------------------------

def validate_password_complexity(password: str):
    """
    Enforces enterprise-grade password validation.
    """
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise serializers.ValidationError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise serializers.ValidationError("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise serializers.ValidationError("Password must contain at least one special character.")

    return password


# ---------------------------------------------------------------
# 2. BASE SERIALIZER (SHARED LOGIC)
# ---------------------------------------------------------------

class BaseRegisterSerializer(serializers.Serializer):
    """
    Shared serializer logic between mentor and mentee registration.
    Handles:
      ✔ password + password confirmation
      ✔ password complexity
      ✔ email format
      ✔ email uniqueness check (locally)
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        # Validate passwords match
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        # Password strength validation
        validate_password_complexity(data["password"])

        # Local DB check for duplicate emails
        if AppUser.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Email is already registered."})

        return data


# ---------------------------------------------------------------
# 3. MENTEE REGISTRATION SERIALIZER
# ---------------------------------------------------------------

class MenteeRegisterSerializer(BaseRegisterSerializer):
    """
    Handles:
      1) Create Auth0 user
      2) Create local AppUser
      3) Create MenteeProfile
    """

    full_name = serializers.CharField(max_length=255)
    field_of_study = serializers.CharField(max_length=255, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100)
    languages = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        help_text="List of preferred languages"
    )
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    user_type = serializers.ChoiceField(
        choices=[
            ("student", "Student"),
            ("professional", "Professional"),
            ("entrepreneur", "Entrepreneur"),
            ("career_changer", "Career Changer"),
            ("job_seeker", "Job Seeker"),
            ("researcher", "Researcher"),
            ("other", "Other"),
        ],
        required=False,
        allow_null=True,
        allow_blank=True
    )
    session_frequency = serializers.ChoiceField(
        choices=[
            ("once_week", "Once a week"),
            ("every_two_weeks", "Every two weeks"),
            ("once_month", "Once a month"),
            ("flexible", "Flexible"),
        ],
        required=False,
        allow_null=True
    )

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        # 1) Create USER in AUTH0
        try:
            auth0_user = Auth0Client.create_user(
                email=email,
                password=password,
                role="mentee",
                approval_status="approved",  # ✅ mentees are allowed to log in immediately
            )
        except ExternalServiceError:
            # Already wrapped in our custom exception format
            raise
        except Exception as e:
            # Any unexpected error -> wrap as ExternalServiceError
            raise ExternalServiceError(str(e))

        # 1.5) Assign RBAC role to user in Auth0
        mentee_role_id = getattr(settings, "AUTH0_MENTEE_ROLE_ID", None)
        if mentee_role_id:
            try:
                Auth0Client.assign_role(
                    auth0_user_id=auth0_user["user_id"],
                    role_id=mentee_role_id,
                )
                logger.info(f"Assigned RBAC role 'mentee' to user {email}")
            except ExternalServiceError:
                # Log but don't fail registration if role assignment fails
                logger.warning(f"Failed to assign RBAC role to mentee {email}, but user was created")

        # 2) Find or create AppUser explicitly
        # Create a temporary Auth0User-like object for the mapping service
        from core.authentication import Auth0User
        temp_auth0_user = Auth0User({
            "sub": auth0_user["user_id"],
            "email": email,
            f"{settings.AUTH0_CUSTOM_NAMESPACE}email": email,
            "email_verified": False,  # Will be set to true after user verifies email
        })
        
        # Try to find existing AppUser (handles edge case where auth0_id already exists
        # due to race condition or identity linking scenario)
        try:
            app_user = IdentityMappingService.map_identity_to_app_user(
                auth0_user=temp_auth0_user,
                chosen_role="mentee",
            )
            # AppUser already exists (identity linking or race condition case)
            # Ensure role is correct
            if app_user.role != "mentee":
                app_user.role = "mentee"
                app_user.save(update_fields=["role"])
        except ValueError:
            # AppUser doesn't exist - create it explicitly
            try:
                app_user = AppUser.objects.create(
                    auth0_id=auth0_user["user_id"],
                    email=email,
                    role="mentee",
                    status="active",
                )
            except IntegrityError as e:
                # Database constraint violation (duplicate email or auth0_id)
                # Clean up Auth0 user since DB operation failed
                logger.error(f"Failed to create AppUser for {email}: {e}. Cleaning up Auth0 user.")
                try:
                    Auth0Client.delete_user(auth0_user["user_id"], ignore_not_found=True)
                except Exception as cleanup_error:
                    logger.error(f"Failed to cleanup Auth0 user {auth0_user['user_id']}: {cleanup_error}")
                
                # Re-raise as validation error
                raise serializers.ValidationError(
                    {"email": "An account with this email or identifier already exists. Please try again."}
                )

        # 3) Create or update MenteeProfile
        # Note: If profile creation fails, transaction.atomic will rollback AppUser creation
        # but Auth0 user will remain (external service limitation - handled by cleanup command)
        try:
            profile, created = MenteeProfile.objects.get_or_create(
                user=app_user,
                defaults={
                    "full_name": validated_data["full_name"],
                    "email": email,
                    "field_of_study": validated_data.get("field_of_study", ""),
                    "country": validated_data["country"],
                    "languages": validated_data.get("languages", []),
                    "profile_picture": validated_data.get("profile_picture"),
                    "user_type": validated_data.get("user_type"),
                    "session_frequency": validated_data.get("session_frequency"),
                }
            )
            
            if not created:
                # Update existing profile
                profile.full_name = validated_data["full_name"]
                profile.email = email
                profile.field_of_study = validated_data.get("field_of_study", profile.field_of_study)
                profile.country = validated_data["country"]
                profile.languages = validated_data.get("languages", profile.languages)
                if validated_data.get("profile_picture"):
                    profile.profile_picture = validated_data["profile_picture"]
                profile.user_type = validated_data.get("user_type", profile.user_type)
                profile.session_frequency = validated_data.get("session_frequency", profile.session_frequency)
                profile.save()
        except Exception as e:
            # Profile creation/update failed - transaction will rollback AppUser
            # Log error for monitoring
            logger.error(f"Failed to create/update MenteeProfile for {email}: {e}", exc_info=True)
            raise

        # Send welcome email
        try:
            send_welcome_email(
                recipient_email=email,
                user_name=profile.full_name,
                user_type="mentee",
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {e}", exc_info=True)

        # Send verification email (Django-based with LinkDeal styling)
        try:
            verification_token = EmailVerificationToken.objects.create(user=app_user)
            send_verification_email(
                recipient_email=email,
                user_name=profile.full_name,
                verification_token=verification_token.token,
            )
        except Exception as e:
            logger.error(f"Failed to send verification email to {email}: {e}", exc_info=True)

        return profile


# ---------------------------------------------------------------
# 3b. SOCIAL MENTEE REGISTRATION SERIALIZER (no password)
# ---------------------------------------------------------------

class SocialMenteeRegisterSerializer(serializers.Serializer):
    """
    Social login based mentee registration (Google/LinkedIn).
    Step 2 of 2-step social registration flow.
    Assumes Auth0 has already authenticated the user (Step 1).
    Uses IdentityMappingService to handle identity linking.
    
    Note: full_name is extracted from the form OR from Auth0 identity provider.
    """

    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    field_of_study = serializers.CharField(max_length=255, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100)
    languages = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        help_text="List of preferred languages"
    )
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    social_picture_url = serializers.URLField(max_length=500, required=False, allow_blank=True, allow_null=True)
    link_consent = serializers.BooleanField(required=False, default=False)
    user_type = serializers.ChoiceField(
        choices=[
            ("student", "Student"),
            ("professional", "Professional"),
            ("entrepreneur", "Entrepreneur"),
            ("career_changer", "Career Changer"),
            ("job_seeker", "Job Seeker"),
            ("researcher", "Researcher"),
            ("other", "Other"),
        ],
        required=False,
        allow_null=True,
        allow_blank=True
    )
    session_frequency = serializers.ChoiceField(
        choices=[
            ("once_week", "Once a week"),
            ("every_two_weeks", "Every two weeks"),
            ("once_month", "Once a month"),
            ("flexible", "Flexible"),
        ],
        required=False,
        allow_null=True
    )

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get("request")
        auth0_user = getattr(request, "user", None)

        if not auth0_user or not auth0_user.email or not auth0_user.auth0_id:
            raise exceptions.ValidationError("Authenticated social user must provide email and auth0_id.")

        email = auth0_user.email
        auth0_id = auth0_user.auth0_id
        
        # Extract name: prefer form data, fallback to Auth0 identity provider
        full_name = validated_data.get('full_name', '').strip()
        if not full_name:
            full_name = getattr(auth0_user, 'name', None) or ''
        if not full_name:
            raise exceptions.ValidationError("Full name is required. Please provide your name.")

        # Check if user is banned/rejected (should not be able to register)
        approval_status = (auth0_user.app_metadata or {}).get("approval_status")
        if approval_status in ["banned", "rejected"]:
            raise exceptions.ValidationError(
                "Account is not allowed to register. Please contact support."
            )

        # NEW: Check if email already exists - FAIL registration if it does
        existing_user = AppUser.objects.filter(email=email).first()
        if existing_user:
            raise exceptions.ValidationError(
                {
                    "email": "An account with this email already exists. "
                             "Please use the account linking flow to connect your social account.",
                    "requires_linking": True,
                }
            )

        # Create new AppUser (no automatic linking)
        try:
            app_user = AppUser.objects.create(
                auth0_id=auth0_id,
                email=email,
                role="mentee",
                status="active",
            )
        except IntegrityError as e:
            # Database constraint violation (duplicate email or auth0_id)
            # This should not happen if email check above worked, but handle race conditions
            logger.error(f"Failed to create AppUser for {email}: {e}. Possible race condition.")
            raise serializers.ValidationError(
                {"email": "An account with this email or identifier already exists. Please try again."}
            )

        # Update Auth0 app_metadata with role + approval_status
        try:
            Auth0Client.update_user_app_metadata(
                auth0_user_id=auth0_id,
                metadata={
                    "role": "mentee",
                    "approval_status": "approved",
                },
            )
        except ExternalServiceError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error updating Auth0 metadata for social mentee {email}")
            raise ExternalServiceError(str(e))

        # Assign mentee role in Auth0 (optional best-effort)
        mentee_role_id = getattr(settings, "AUTH0_MENTEE_ROLE_ID", None)
        if mentee_role_id:
            try:
                Auth0Client.assign_role(auth0_user_id=auth0_id, role_id=mentee_role_id)
            except ExternalServiceError:
                logger.warning("Failed to assign RBAC role to social mentee %s", email)

        # Create or update MenteeProfile
        # Note: If profile creation fails, transaction.atomic will rollback AppUser creation
        # but Auth0 user will remain (external service limitation - handled by cleanup command)
        
        # Get social picture URL from request data (sent by frontend from sessionStorage)
        social_picture = validated_data.get('social_picture_url')
        
        # DEBUG: Log social picture URL
        logger.info(f"=== DEBUG: Social Registration for {email} ===")
        logger.info(f"social_picture_url from validated_data: {social_picture}")
        
        try:
            profile, profile_created = MenteeProfile.objects.get_or_create(
                user=app_user,
                defaults={
                    "full_name": full_name,  # From Auth0, not from form
                    "email": email,
                    "field_of_study": validated_data.get("field_of_study", ""),
                    "country": validated_data["country"],
                    "languages": validated_data.get("languages", []),
                    "profile_picture": validated_data.get("profile_picture"),
                    "social_picture_url": social_picture,  # Store Google/LinkedIn picture URL
                    "user_type": validated_data.get("user_type"),
                    "session_frequency": validated_data.get("session_frequency"),
                }
            )
            
            if not profile_created:
                # Update existing profile
                profile.full_name = full_name  # From Auth0, not from form
                profile.email = email
                profile.field_of_study = validated_data.get("field_of_study", profile.field_of_study)
                profile.country = validated_data["country"]
                profile.languages = validated_data.get("languages", profile.languages)
                if validated_data.get("profile_picture"):
                    profile.profile_picture = validated_data["profile_picture"]
                profile.user_type = validated_data.get("user_type", profile.user_type)
                profile.session_frequency = validated_data.get("session_frequency", profile.session_frequency)
                profile.save()
        except Exception as e:
            # Profile creation/update failed - transaction will rollback AppUser
            # Log error for monitoring
            logger.error(f"Failed to create/update MenteeProfile for {email}: {e}", exc_info=True)
            raise ExternalServiceError("Failed to create mentee profile. Please try again.")

        # Send welcome email
        try:
            send_welcome_email(
                recipient_email=email,
                user_name=profile.full_name,
                user_type="mentee",
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {e}", exc_info=True)

        return profile


# ---------------------------------------------------------------
# 4. MENTOR REGISTRATION SERIALIZER
# ---------------------------------------------------------------

class MentorRegisterSerializer(BaseRegisterSerializer):
    """
    Handles:
      1) Creating Auth0 user
      2) Creating local AppUser
      3) Creating MentorProfile (status=pending)
    """

    full_name = serializers.CharField(max_length=255)
    professional_title = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    linkedin_url = serializers.URLField()
    bio = serializers.CharField()
    languages = serializers.CharField(max_length=255)
    country = serializers.CharField(max_length=100)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    cv = serializers.FileField(required=True)
    
    # NEW FIELDS
    skills = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        allow_empty=True,
        max_length=20,
        help_text="List of skills (max 20 skills, 50 chars each)"
    )

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        # 1) Create the user in Auth0
        try:
            auth0_user = Auth0Client.create_user(
                email=email,
                password=password,
                role="mentor",
                approval_status="pending",  # 🔴 critical: pending mentors are blocked at login
            )
        except ExternalServiceError:
            raise
        except Exception as e:
            raise ExternalServiceError(str(e))

        # 1.5) Assign RBAC role to user in Auth0
        mentor_role_id = getattr(settings, "AUTH0_MENTOR_ROLE_ID", None)
        if mentor_role_id:
            try:
                Auth0Client.assign_role(
                    auth0_user_id=auth0_user["user_id"],
                    role_id=mentor_role_id,
                )
                logger.info(f"Assigned RBAC role 'mentor' to user {email}")
            except ExternalServiceError:
                # Log but don't fail registration if role assignment fails
                logger.warning(f"Failed to assign RBAC role to mentor {email}, but user was created")

        # 2) Find or create AppUser explicitly
        from core.authentication import Auth0User
        temp_auth0_user = Auth0User({
            "sub": auth0_user["user_id"],
            "email": email,
            f"{settings.AUTH0_CUSTOM_NAMESPACE}email": email,
            "email_verified": False,  # Will be set to true after user verifies email
        })
        
        # Try to find existing AppUser (handles edge case where auth0_id already exists
        # due to race condition or identity linking scenario)
        try:
            app_user = IdentityMappingService.map_identity_to_app_user(
                auth0_user=temp_auth0_user,
                chosen_role="mentor",
            )
            # AppUser already exists (identity linking or race condition case)
            # Ensure role is correct
            if app_user.role != "mentor":
                app_user.role = "mentor"
                app_user.save(update_fields=["role"])
        except ValueError:
            # AppUser doesn't exist - create it explicitly
            try:
                app_user = AppUser.objects.create(
                    auth0_id=auth0_user["user_id"],
                    email=email,
                    role="mentor",
                    status="active",
                )
            except IntegrityError as e:
                # Database constraint violation (duplicate email or auth0_id)
                # Clean up Auth0 user since DB operation failed
                logger.error(f"Failed to create AppUser for {email}: {e}. Cleaning up Auth0 user.")
                try:
                    Auth0Client.delete_user(auth0_user["user_id"], ignore_not_found=True)
                except Exception as cleanup_error:
                    logger.error(f"Failed to cleanup Auth0 user {auth0_user['user_id']}: {cleanup_error}")
                
                # Re-raise as validation error
                raise serializers.ValidationError(
                    {"email": "An account with this email or identifier already exists. Please try again."}
                )

        # 3) Create or update MentorProfile (status = pending for new registrations)
        # Note: If profile creation fails, transaction.atomic will rollback AppUser creation
        # but Auth0 user will remain (external service limitation - handled by cleanup command)
        try:
            profile, created = MentorProfile.objects.get_or_create(
                user=app_user,
                defaults={
                    "email": email,
                    "full_name": validated_data["full_name"],
                    "professional_title": validated_data["professional_title"],
                    "location": validated_data["location"],
                    "linkedin_url": validated_data["linkedin_url"],
                    "bio": validated_data["bio"],
                    "languages": validated_data["languages"],
                    "country": validated_data["country"],
                    "profile_picture": validated_data.get("profile_picture"),
                    "cv": validated_data["cv"],
                    "status": "pending",  # Always pending for new mentor registrations
                    # NEW FIELD
                    "skills": validated_data.get("skills", []),
                }
            )
            
            if not created:
                # Update existing profile (but preserve status if already approved/banned/rejected)
                profile.email = email
                profile.full_name = validated_data["full_name"]
                profile.professional_title = validated_data["professional_title"]
                profile.location = validated_data["location"]
                profile.linkedin_url = validated_data["linkedin_url"]
                profile.bio = validated_data["bio"]
                profile.languages = validated_data["languages"]
                profile.country = validated_data["country"]
                if validated_data.get("profile_picture"):
                    profile.profile_picture = validated_data["profile_picture"]
                if validated_data.get("cv"):
                    profile.cv = validated_data["cv"]
                # NEW FIELD
                profile.skills = validated_data.get("skills", profile.skills)
                # Only set to pending if currently pending (don't override approved/rejected/banned)
                if profile.status == "pending":
                    profile.status = "pending"
                profile.save()
        except Exception as e:
            # Profile creation/update failed - transaction will rollback AppUser
            # Log error for monitoring
            logger.error(f"Failed to create/update MentorProfile for {email}: {e}", exc_info=True)
            raise

        # Send welcome email
        try:
            send_welcome_email(
                recipient_email=email,
                user_name=profile.full_name,
                user_type="mentor",
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {e}", exc_info=True)

        # Send verification email (Django-based with LinkDeal styling)
        try:
            verification_token = EmailVerificationToken.objects.create(user=app_user)
            send_verification_email(
                recipient_email=email,
                user_name=profile.full_name,
                verification_token=verification_token.token,
            )
        except Exception as e:
            logger.error(f"Failed to send verification email to {email}: {e}", exc_info=True)

        return profile


# ---------------------------------------------------------------
# 4b. SOCIAL MENTOR REGISTRATION SERIALIZER (no password)
# ---------------------------------------------------------------

class SocialMentorRegisterSerializer(serializers.Serializer):
    """
    Social login based mentor registration (Google/LinkedIn).
    Creates mentor with status 'pending' (requires admin approval).
    
    Note: full_name is extracted from the form OR from Auth0 identity provider.
    """

    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    professional_title = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    languages = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        help_text="List of languages"
    )
    country = serializers.CharField(max_length=100)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    social_picture_url = serializers.URLField(max_length=500, required=False, allow_blank=True, allow_null=True)
    cv = serializers.FileField(required=True)
    link_consent = serializers.BooleanField(required=False, default=False)
    
    # NEW FIELDS
    skills = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        allow_empty=True,
        max_length=20,
        help_text="List of skills (max 20 skills, 50 chars each)"
    )

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get("request")
        auth0_user = getattr(request, "user", None)

        if not auth0_user or not auth0_user.email or not auth0_user.auth0_id:
            raise exceptions.ValidationError("Authenticated social user must provide email and auth0_id.")

        email = auth0_user.email
        auth0_id = auth0_user.auth0_id
        
        # Extract name: prefer form data, fallback to Auth0 identity provider
        full_name = validated_data.get('full_name', '').strip()
        if not full_name:
            full_name = getattr(auth0_user, 'name', None) or ''
        if not full_name:
            raise exceptions.ValidationError("Full name is required. Please provide your name.")

        # Check if user is banned/rejected (should not be able to register)
        approval_status = (auth0_user.app_metadata or {}).get("approval_status")
        if approval_status in ["banned", "rejected"]:
            raise exceptions.ValidationError(
                "Account is not allowed to register. Please contact support."
            )

        # NEW: Check if email already exists - FAIL registration if it does
        existing_user = AppUser.objects.filter(email=email).first()
        if existing_user:
            raise exceptions.ValidationError(
                {
                    "email": "An account with this email already exists. "
                             "Please use the account linking flow to connect your social account.",
                    "requires_linking": True,
                }
            )

        # Create new AppUser (no automatic linking)
        try:
            app_user = AppUser.objects.create(
                auth0_id=auth0_id,
                email=email,
                role="mentor",
                status="active",
            )
        except IntegrityError as e:
            # Database constraint violation (duplicate email or auth0_id)
            # This should not happen if email check above worked, but handle race conditions
            logger.error(f"Failed to create AppUser for {email}: {e}. Possible race condition.")
            raise serializers.ValidationError(
                {"email": "An account with this email or identifier already exists. Please try again."}
            )

        # Update Auth0 app_metadata with role + approval_status (pending)
        try:
            Auth0Client.update_user_app_metadata(
                auth0_user_id=auth0_id,
                metadata={
                    "role": "mentor",
                    "approval_status": "pending",
                },
            )
        except ExternalServiceError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error updating Auth0 metadata for social mentor {email}")
            raise ExternalServiceError(str(e))

        # Assign mentor role in Auth0 (optional best-effort)
        mentor_role_id = getattr(settings, "AUTH0_MENTOR_ROLE_ID", None)
        if mentor_role_id:
            try:
                Auth0Client.assign_role(auth0_user_id=auth0_id, role_id=mentor_role_id)
            except ExternalServiceError:
                logger.warning("Failed to assign RBAC role to social mentor %s", email)

        # Create or update MentorProfile (status = pending for new registrations)
        # Note: If profile creation fails, transaction.atomic will rollback AppUser creation
        # but Auth0 user will remain (external service limitation - handled by cleanup command)
        
        # Get social picture URL from request data (sent by frontend from sessionStorage)
        social_picture = validated_data.get('social_picture_url')
        
        try:
            profile, profile_created = MentorProfile.objects.get_or_create(
                user=app_user,
                defaults={
                    "email": email,
                    "full_name": full_name,  # From Auth0, not from form
                    "professional_title": validated_data["professional_title"],
                    "location": validated_data["location"],
                    "linkedin_url": validated_data["linkedin_url"],
                    "bio": validated_data["bio"],
                    "languages": validated_data["languages"],
                    "country": validated_data["country"],
                    "profile_picture": validated_data.get("profile_picture"),
                    "social_picture_url": social_picture,
                    "cv": validated_data["cv"],
                    "status": "pending",  # Always pending for new mentor registrations
                    # NEW FIELD
                    "skills": validated_data.get("skills", []),
                }
            )
            
            if not profile_created:
                # Update existing profile (but preserve status if already approved/banned/rejected)
                profile.email = email
                profile.full_name = full_name  # From Auth0, not from form
                profile.professional_title = validated_data["professional_title"]
                profile.location = validated_data["location"]
                profile.linkedin_url = validated_data["linkedin_url"]
                profile.bio = validated_data["bio"]
                profile.languages = validated_data["languages"]
                profile.country = validated_data["country"]
                if validated_data.get("profile_picture"):
                    profile.profile_picture = validated_data["profile_picture"]
                if validated_data.get("cv"):
                    profile.cv = validated_data["cv"]
                # NEW FIELD
                profile.skills = validated_data.get("skills", profile.skills)
                profile.social_picture_url = social_picture
                # Only set to pending if currently pending (don't override approved/rejected/banned)
                if profile.status == "pending":
                    profile.status = "pending"
                profile.save()
        except Exception as e:
            # Profile creation/update failed - transaction will rollback AppUser
            # Log error for monitoring
            logger.error(f"Failed to create/update MentorProfile for {email}: {e}", exc_info=True)
            raise ExternalServiceError("Failed to create mentor profile. Please try again.")

        # Send welcome email
        try:
            send_welcome_email(
                recipient_email=email,
                user_name=profile.full_name,
                user_type="mentor",
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {e}", exc_info=True)

        return profile


class AdminMentorSerializer(serializers.ModelSerializer):
    """
    Compact mentor info for listing (pending, approved, etc.).
    """
    user_id = serializers.UUIDField(source="user.id", read_only=True)
    auth0_id = serializers.CharField(source="user.auth0_id", read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()
    banned_by_email = serializers.SerializerMethodField()
    sessions_count = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = MentorProfile
        fields = [
            "id",
            "user_id",
            "auth0_id",
            "full_name",
            "email",
            "professional_title",
            "location",
            "linkedin_url",
            "country",
            "status",
            "banned_at",
            "ban_reason",
            "banned_by_email",
            "created_at",
            "last_active",
            "profile_picture_url",
            "social_picture_url",
            "cv_url",
            "skills",
            "sessions_count",
            "total_amount",
        ]

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and hasattr(obj.profile_picture, "url"):
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def get_cv_url(self, obj):
        request = self.context.get("request")
        if obj.cv and hasattr(obj.cv, "url"):
            if request:
                return request.build_absolute_uri(obj.cv.url)
            return obj.cv.url
        return None

    def get_banned_by_email(self, obj):
        if obj.banned_by:
            return obj.banned_by.email
        return None

    def get_sessions_count(self, obj):
        """Get the count of completed sessions for this mentor."""
        from scheduling.models import Session
        return Session.objects.filter(mentor=obj, status='completed').count()

    def get_total_amount(self, obj):
        """Get the total amount earned from completed sessions."""
        from scheduling.models import Session
        from django.db.models import Sum
        result = Session.objects.filter(mentor=obj, status='completed').aggregate(total=Sum('price'))
        return float(result['total'] or 0)


class AdminMentorDetailSerializer(AdminMentorSerializer):
    """
    Full mentor details for the approval view.
    Extends the list serializer in case we later add more fields.
    """
    bio = serializers.CharField()
    languages = serializers.CharField()

    class Meta(AdminMentorSerializer.Meta):
        fields = AdminMentorSerializer.Meta.fields + [
            "bio",
            "languages",
        ]


class AdminMenteeSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.id", read_only=True)
    auth0_id = serializers.CharField(source="user.auth0_id", read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    banned_by_email = serializers.SerializerMethodField()
    sessions_count = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = MenteeProfile
        fields = [
            "id",
            "user_id",
            "auth0_id",
            "full_name",
            "email",
            "field_of_study",
            "country",
            "status",
            "banned_at",
            "ban_reason",
            "banned_by_email",
            "created_at",
            "last_active",
            "profile_picture_url",
            "social_picture_url",
            "sessions_count",
            "total_amount",
        ]

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and hasattr(obj.profile_picture, "url"):
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def get_banned_by_email(self, obj):
        if obj.banned_by:
            return obj.banned_by.email
        return None

    def get_sessions_count(self, obj):
        """Get the count of completed sessions for this mentee."""
        from scheduling.models import Session
        return Session.objects.filter(mentee=obj, status='completed').count()

    def get_total_amount(self, obj):
        """Get the total amount spent on completed sessions."""
        from scheduling.models import Session
        from django.db.models import Sum
        result = Session.objects.filter(mentee=obj, status='completed').aggregate(total=Sum('price'))
        return float(result['total'] or 0)


# ---------------------------------------------------------------
# 7. ADMIN INVITATION SERIALIZER
# ---------------------------------------------------------------

class AdminInviteSerializer(serializers.Serializer):
    """
    Serializer for inviting a new admin user.
    Only accessible to super_admin users.
    """
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(max_length=255, required=True, allow_blank=False)
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)

    def validate_email(self, value):
        """Check if email is already used by an existing user."""
        if AppUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already used by an existing user. This flow is only for new users. Promotion is out of scope."
            )
        return value

    def validate_full_name(self, value):
        """Ensure full_name is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Full name cannot be empty.")
        return value.strip()

    @transaction.atomic
    def create(self, validated_data):
        """
        Create a new admin user in Auth0 and local DB.
        Returns the created AppUser.
        """
        email = validated_data["email"]
        full_name = validated_data["full_name"]
        notes = validated_data.get("notes", "")
        
        # Get the inviting super_admin from context
        inviting_user = self.context.get("request").user
        inviting_app_user = None
        
        # Get AppUser for the inviting super_admin
        try:
            inviting_app_user = AppUser.objects.get(auth0_id=inviting_user.auth0_id)
        except AppUser.DoesNotExist:
            logger.warning(f"Inviting user {inviting_user.auth0_id} not found in DB")
        
        # 1) Create user in Auth0 WITHOUT password
        try:
            auth0_user = Auth0Client.create_user_without_password(
                email=email,
                role="admin",
                approval_status="approved",
                user_metadata={
                    "full_name": full_name,
                    "notes": notes,
                },
            )
        except ExternalServiceError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error creating Auth0 user for {email}")
            raise ExternalServiceError(f"Failed to create user in Auth0: {str(e)}")

        auth0_user_id = auth0_user["user_id"]

        # 2) Assign admin role in Auth0
        admin_role_id = getattr(settings, "AUTH0_ADMIN_ROLE_ID", None)
        if admin_role_id:
            try:
                Auth0Client.assign_role(
                    auth0_user_id=auth0_user_id,
                    role_id=admin_role_id,
                )
                logger.info(f"Assigned RBAC role 'admin' to user {email}")
            except ExternalServiceError:
                # Log but don't fail invitation if role assignment fails
                logger.warning(f"Failed to assign RBAC role to admin {email}, but user was created")

        # 3) Send password reset email so user can set their own password
        try:
            Auth0Client.send_password_reset_email(email=email)
            logger.info(f"Sent password reset email to {email}")
        except ExternalServiceError:
            # Log but don't fail invitation if email sending fails
            logger.warning(f"Failed to send password reset email to {email}, but user was created")

        # 4) Create AppUser in local DB
        app_user = AppUser.objects.create(
            auth0_id=auth0_user_id,
            email=email,
            role="admin",
            invited_by=inviting_app_user,
            invited_at=timezone.now(),
            status="invited",
        )

        logger.info(f"Created admin user {email} (invited by {inviting_app_user.email if inviting_app_user else 'system'})")
        return app_user