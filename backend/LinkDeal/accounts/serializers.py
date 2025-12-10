import re
import logging
from rest_framework import serializers
from django.db import transaction
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from accounts.models import AppUser, MentorProfile, MenteeProfile
from accounts.auth0_client import Auth0Client
from accounts.services import IdentityMappingService
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
    field_of_study = serializers.CharField(max_length=255)
    country = serializers.CharField(max_length=100)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

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
            # Trigger verification email for DB users (non-social)
            Auth0Client.send_verification_email(auth0_user_id=auth0_user["user_id"])
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

        # 2) Map identity to AppUser using the service (respects chosen role)
        # Create a temporary Auth0User-like object for the mapping service
        from core.authentication import Auth0User
        temp_auth0_user = Auth0User({
            "sub": auth0_user["user_id"],
            "email": email,
            f"{settings.AUTH0_CUSTOM_NAMESPACE}email": email,
            "email_verified": False,  # Will be set to true after user verifies email
        })
        
        app_user, _ = IdentityMappingService.map_identity_to_app_user(
            auth0_user=temp_auth0_user,
            chosen_role="mentee",  # Always mentee for this serializer
        )
        
        # Ensure role is correct (in case of identity linking)
        if app_user.role != "mentee":
            app_user.role = "mentee"
            app_user.save(update_fields=["role"])

        # 3) Create or update MenteeProfile
        profile, created = MenteeProfile.objects.get_or_create(
            user=app_user,
            defaults={
                "full_name": validated_data["full_name"],
                "email": email,
                "field_of_study": validated_data["field_of_study"],
                "country": validated_data["country"],
                "profile_picture": validated_data.get("profile_picture"),
            }
        )
        
        if not created:
            # Update existing profile
            profile.full_name = validated_data["full_name"]
            profile.email = email
            profile.field_of_study = validated_data["field_of_study"]
            profile.country = validated_data["country"]
            if validated_data.get("profile_picture"):
                profile.profile_picture = validated_data["profile_picture"]
            profile.save()

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
    """

    full_name = serializers.CharField(max_length=255)
    field_of_study = serializers.CharField(max_length=255)
    country = serializers.CharField(max_length=100)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    link_consent = serializers.BooleanField(required=False, default=False)

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get("request")
        auth0_user = getattr(request, "user", None)

        if not auth0_user or not auth0_user.email or not auth0_user.auth0_id:
            raise exceptions.ValidationError("Authenticated social user must provide email and auth0_id.")

        email = auth0_user.email
        auth0_id = auth0_user.auth0_id

        # Check if user is banned/rejected (should not be able to register)
        approval_status = (auth0_user.app_metadata or {}).get("approval_status")
        if approval_status in ["banned", "rejected"]:
            raise exceptions.ValidationError(
                "Account is not allowed to register. Please contact support."
            )

        # If a DB identity exists but is not verified, block linking until email is verified.
        link_consent = validated_data.get("link_consent", False)
        unverified_db_auth0_id = Auth0Client.get_unverified_db_identity(email=email)
        if unverified_db_auth0_id:
            if link_consent:
                try:
                    Auth0Client.send_verification_email(auth0_user_id=unverified_db_auth0_id)
                except ExternalServiceError:
                    raise
                raise exceptions.ValidationError(
                    "Un compte base de données existe mais l'email n'est pas vérifié. "
                    "Un email de vérification vient d'être envoyé. Vérifiez puis réessayez le lien."
                )
            else:
                raise exceptions.ValidationError(
                    "Un compte base de données non vérifié existe déjà pour cet email. "
                    "Veuillez vérifier votre email avant de lier ce compte social."
                )

        # Map identity to AppUser using the service (respects chosen role: mentee)
        app_user, was_created = IdentityMappingService.map_identity_to_app_user(
            auth0_user=auth0_user,
            chosen_role="mentee",  # Always mentee for this serializer
        )
        
        # Ensure role is correct (in case of identity linking)
        if app_user.role != "mentee":
            app_user.role = "mentee"
            app_user.save(update_fields=["role"])

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
        profile, profile_created = MenteeProfile.objects.get_or_create(
            user=app_user,
            defaults={
                "full_name": validated_data["full_name"],
                "email": email,
                "field_of_study": validated_data["field_of_study"],
                "country": validated_data["country"],
                "profile_picture": validated_data.get("profile_picture"),
            }
        )
        
        if not profile_created:
            # Update existing profile
            profile.full_name = validated_data["full_name"]
            profile.email = email
            profile.field_of_study = validated_data["field_of_study"]
            profile.country = validated_data["country"]
            if validated_data.get("profile_picture"):
                profile.profile_picture = validated_data["profile_picture"]
            profile.save()

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
            # Trigger verification email for DB users (non-social)
            Auth0Client.send_verification_email(auth0_user_id=auth0_user["user_id"])
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

        # 2) Map identity to AppUser using the service (respects chosen role)
        from core.authentication import Auth0User
        temp_auth0_user = Auth0User({
            "sub": auth0_user["user_id"],
            "email": email,
            f"{settings.AUTH0_CUSTOM_NAMESPACE}email": email,
            "email_verified": False,  # Will be set to true after user verifies email
        })
        
        app_user, _ = IdentityMappingService.map_identity_to_app_user(
            auth0_user=temp_auth0_user,
            chosen_role="mentor",  # Always mentor for this serializer
        )
        
        # Ensure role is correct (in case of identity linking)
        if app_user.role != "mentor":
            app_user.role = "mentor"
            app_user.save(update_fields=["role"])

        # 3) Create or update MentorProfile (status = pending for new registrations)
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
            # Only set to pending if currently pending (don't override approved/rejected/banned)
            if profile.status == "pending":
                profile.status = "pending"
            profile.save()

        return profile


# ---------------------------------------------------------------
# 4b. SOCIAL MENTOR REGISTRATION SERIALIZER (no password)
# ---------------------------------------------------------------

class SocialMentorRegisterSerializer(serializers.Serializer):
    """
    Social login based mentor registration (Google/LinkedIn).
    Creates mentor with status 'pending' (requires admin approval).
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
    link_consent = serializers.BooleanField(required=False, default=False)

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get("request")
        auth0_user = getattr(request, "user", None)

        if not auth0_user or not auth0_user.email or not auth0_user.auth0_id:
            raise exceptions.ValidationError("Authenticated social user must provide email and auth0_id.")

        email = auth0_user.email
        auth0_id = auth0_user.auth0_id

        # Check if user is banned/rejected (should not be able to register)
        approval_status = (auth0_user.app_metadata or {}).get("approval_status")
        if approval_status in ["banned", "rejected"]:
            raise exceptions.ValidationError(
                "Account is not allowed to register. Please contact support."
            )

        # If a DB identity exists but is not verified, block linking until email is verified.
        link_consent = validated_data.get("link_consent", False)
        unverified_db_auth0_id = Auth0Client.get_unverified_db_identity(email=email)
        if unverified_db_auth0_id:
            if link_consent:
                try:
                    Auth0Client.send_verification_email(auth0_user_id=unverified_db_auth0_id)
                except ExternalServiceError:
                    raise
                raise exceptions.ValidationError(
                    "Un compte base de données existe mais l'email n'est pas vérifié. "
                    "Un email de vérification vient d'être envoyé. Vérifiez puis réessayez le lien."
                )
            else:
                raise exceptions.ValidationError(
                    "Un compte base de données non vérifié existe déjà pour cet email. "
                    "Veuillez vérifier votre email avant de lier ce compte social."
                )

        # Map identity to AppUser using the service (respects chosen role: mentor)
        app_user, was_created = IdentityMappingService.map_identity_to_app_user(
            auth0_user=auth0_user,
            chosen_role="mentor",  # Always mentor for this serializer
        )
        
        # Ensure role is correct (in case of identity linking)
        if app_user.role != "mentor":
            app_user.role = "mentor"
            app_user.save(update_fields=["role"])

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
        profile, profile_created = MentorProfile.objects.get_or_create(
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
            }
        )
        
        if not profile_created:
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
            # Only set to pending if currently pending (don't override approved/rejected/banned)
            if profile.status == "pending":
                profile.status = "pending"
            profile.save()

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
            "profile_picture_url",
            "cv_url",
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
            "profile_picture_url",
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