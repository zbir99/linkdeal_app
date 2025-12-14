import logging

from rest_framework.throttling import ScopedRateThrottle
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from accounts.permissions import IsAuthenticatedAuth0
from core.authentication import Auth0JWTRegistrationAuthentication
from accounts.serializers import (
    MentorRegisterSerializer,
    MenteeRegisterSerializer,
    SocialMentorRegisterSerializer,
    SocialMenteeRegisterSerializer,
)
from accounts.models import AppUser, EmailVerificationToken, PasswordResetToken, MentorProfile
from accounts.auth0_client import Auth0Client
from accounts.email_service import send_verification_email, send_password_reset_email
from core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class MentorRegisterView(generics.CreateAPIView):
    serializer_class = MentorRegisterSerializer
    permission_classes = []
    authentication_classes = []  # No authentication required for registration
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"


class MenteeRegisterView(generics.CreateAPIView):
    serializer_class = MenteeRegisterSerializer
    permission_classes = []
    authentication_classes = []  # No authentication required for registration
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"




class MeView(APIView):
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        user = request.user
        
        # Check if account linking is required (email exists with different auth method)
        if getattr(user, 'requires_linking', False):
            return Response({
                "requires_linking": True,
                "email": user.email,
                "existing_role": getattr(user, 'existing_role', 'mentee'),
                "message": "An account with this email already exists. Please link your accounts."
            })
        
        # Use app_metadata as fallback for email and role if not in token
        # app_metadata is always a dict (initialized in Auth0User), but add safety check
        app_metadata = getattr(user, 'app_metadata', {}) or {}
        email = user.email or app_metadata.get("email")
        role = user.role or app_metadata.get("role")

        # Custom response construction
        response_data = {
            "auth0_id": user.auth0_id,
            "email": email,
            "role": role,
            "roles": user.roles,
            "app_metadata": app_metadata,
            "permissions": user.permissions,
        }

        # If user is a mentor, include skills from profile
        if role == 'mentor':
            try:
                # Get the AppUser instance first (request.user is Auth0User, not AppUser)
                app_user = AppUser.objects.get(auth0_id=user.auth0_id)
                mentor_profile = MentorProfile.objects.get(user=app_user)
                response_data['skills'] = mentor_profile.skills
            except (AppUser.DoesNotExist, MentorProfile.DoesNotExist):
                response_data['skills'] = []

        return Response(response_data)


# ---------------------------------------------------------------
# SOCIAL REGISTRATION (Google / LinkedIn)
# ---------------------------------------------------------------

class SocialMenteeRegisterView(generics.CreateAPIView):
    """
    POST /auth/register/mentee/social/
    Requires Auth0 JWT (Google/LinkedIn).
    Uses registration-specific auth that doesn't require existing AppUser.
    """
    serializer_class = SocialMenteeRegisterSerializer
    authentication_classes = [Auth0JWTRegistrationAuthentication]
    permission_classes = []  # No permission check needed - auth validates the JWT
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"

    def create(self, request, *args, **kwargs):
        """
        Step 2 of 2-step social registration: Complete mentee profile.
        The serializer handles identity mapping and profile creation/update.
        """
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(
            {
                "success": True,
                "data": {
                    "id": str(profile.user.id),
                    "email": profile.email,
                    "role": "mentee",
                }
            },
            status=status.HTTP_201_CREATED,
        )


class SocialMentorRegisterView(generics.CreateAPIView):
    """
    POST /auth/register/mentor/social/
    Requires Auth0 JWT (Google/LinkedIn).
    Creates mentor with status 'pending' (admin approval required).
    Uses registration-specific auth that doesn't require existing AppUser.
    """
    serializer_class = SocialMentorRegisterSerializer
    authentication_classes = [Auth0JWTRegistrationAuthentication]
    permission_classes = []  # No permission check needed - auth validates the JWT
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"

    def create(self, request, *args, **kwargs):
        """
        Step 2 of 2-step social registration: Complete mentor profile.
        The serializer handles identity mapping and profile creation/update.
        """
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(
            {
                "success": True,
                "data": {
                    "id": str(profile.user.id),
                    "email": profile.email,
                    "role": "mentor",
                    "status": profile.status,
                },
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------
# LOGOUT
# ---------------------------------------------------------------

class LogoutView(APIView):
    """
    POST /auth/logout/
    Logs out the current user by clearing session data.
    Works for all user types: mentee, mentor, admin, super_admin.
    
    Note: JWT tokens are stateless, so the frontend must clear the token from storage.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request):
        """
        Logout the user by clearing session data.
        Returns success response. Frontend should clear JWT token from storage.
        """
        # Get user info before clearing (for logging)
        user_email = getattr(request.user, 'email', 'unknown')
        user_role = getattr(request.user, 'role', 'unknown')
        auth0_id = getattr(request.user, 'auth0_id', 'unknown')
        
        # Clear Django session if it exists
        if hasattr(request, 'session'):
            request.session.flush()
        
        logger.info(f"User logged out: {user_email} (role: {user_role}, auth0_id: {auth0_id})")
        
        return Response(
            {
                "success": True,
                "message": "Successfully logged out. Please clear your token from client storage.",
            },
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------
# EMAIL VERIFICATION
# ---------------------------------------------------------------

class VerifyEmailView(APIView):
    """
    POST /auth/verify-email/<token>/
    Verifies email using token sent via email.
    """
    permission_classes = []  # Public

    def post(self, request, token):
        """
        Verify email using the provided token.
        """
        try:
            verification = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"success": False, "message": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if already verified
        if verification.verified:
            return Response(
                {"success": True, "message": "Email already verified."},
                status=status.HTTP_200_OK,
            )
        
        # Check if expired
        if verification.is_expired():
            return Response(
                {"success": False, "message": "Verification link has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Verify the email
        try:
            # Mark as verified in local DB
            verification.verify()
            
            # Mark as verified in Auth0
            Auth0Client.mark_email_verified(verification.user.auth0_id)
            
            logger.info(f"Email verified for user: {verification.user.email}")
            
            return Response(
                {"success": True, "message": "Email verified successfully! You can now log in."},
                status=status.HTTP_200_OK,
            )
        except ExternalServiceError as e:
            logger.error(f"Failed to verify email in Auth0: {e}")
            return Response(
                {"success": False, "message": "Failed to verify email. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResendVerificationEmailView(APIView):
    """
    POST /auth/resend-verification/
    Resends verification email to the user.
    """
    permission_classes = []  # Public
    throttle_classes = []  # No throttling (or configure in settings)

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()

        if not email:
            return Response(
                {"success": False, "message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"success": False, "message": "Invalid email format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Always return success to prevent email enumeration
        try:
            user = AppUser.objects.get(email=email)
            
            # Get user's name from profile
            user_name = email
            if hasattr(user, 'mentee_profile') and user.mentee_profile:
                user_name = user.mentee_profile.full_name
            elif hasattr(user, 'mentor_profile') and user.mentor_profile:
                user_name = user.mentor_profile.full_name
            
            # Create new verification token
            token = EmailVerificationToken.objects.create(user=user)
            
            # Send email
            send_verification_email(
                recipient_email=email,
                user_name=user_name,
                verification_token=token.token,
            )
            
            logger.info(f"Resent verification email to: {email}")
        except AppUser.DoesNotExist:
            logger.info(f"Verification email requested for non-existent user: {email}")
        except Exception as e:
            logger.error(f"Failed to resend verification email to {email}: {e}")

        return Response(
            {"success": True, "message": "If an account exists, a verification email has been sent."},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------
# PASSWORD RESET
# ---------------------------------------------------------------

class PasswordResetRequestView(APIView):
    """
    POST /auth/password/reset/  (alias: /auth/reset-password/)
    Always returns success message (no email existence leak).
    Now uses Django email service instead of Auth0.
    """
    permission_classes = []  # Public
    throttle_classes = []  # No throttling (or configure in settings)

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()

        if not email:
            return Response(
                {"success": False, "message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"success": False, "message": "Invalid email format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Always return success to prevent email enumeration
        try:
            # Check if user has a DB identity (not social-only)
            has_db_identity = False
            auth0_user_id = None
            try:
                has_db_identity = Auth0Client.user_has_db_identity(email=email)
                if has_db_identity:
                    # Get the Auth0 user ID
                    users = Auth0Client.find_users_by_email(email=email)
                    for user in users:
                        identities = user.get("identities") or []
                        for identity in identities:
                            if identity.get("provider") == "auth0":
                                auth0_user_id = user.get("user_id")
                                break
                        if auth0_user_id:
                            break
            except ExternalServiceError as exc:
                logger.warning("Could not verify DB identity for %s: %s", email, exc)

            if has_db_identity and auth0_user_id:
                # Get user name from local DB if available
                user_name = email
                try:
                    app_user = AppUser.objects.get(email=email)
                    if hasattr(app_user, 'mentee_profile') and app_user.mentee_profile:
                        user_name = app_user.mentee_profile.full_name
                    elif hasattr(app_user, 'mentor_profile') and app_user.mentor_profile:
                        user_name = app_user.mentor_profile.full_name
                except AppUser.DoesNotExist:
                    pass
                
                # Invalidate any existing reset tokens for this email
                PasswordResetToken.objects.filter(email=email, used=False).update(used=True)
                
                # Create new reset token
                token = PasswordResetToken.objects.create(
                    email=email,
                    auth0_user_id=auth0_user_id,
                )
                
                # Send password reset email
                try:
                    send_password_reset_email(
                        recipient_email=email,
                        user_name=user_name,
                        reset_token=token.token,
                    )
                    logger.info(f"Sent password reset email to: {email}")
                except Exception as e:
                    logger.error(f"Failed to send password reset email to {email}: {e}")
            else:
                # Social-only users or non-existent emails
                logger.info(f"Password reset requested for social-only/non-existent user: {email}")

        except Exception as exc:
            logger.warning("Unexpected error during password reset for %s: %s", email, exc)

        return Response(
            {
                "success": True,
                "message": "If an account exists for this email, a password reset link has been sent.",
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    """
    POST /auth/reset-password/confirm/
    Validates token and updates password in Auth0.
    """
    permission_classes = []  # Public
    throttle_classes = []  # No throttling (or configure in settings)

    def post(self, request):
        token = (request.data.get("token") or "").strip()
        new_password = request.data.get("password") or ""

        if not token:
            return Response(
                {"success": False, "message": "Reset token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"success": False, "message": "New password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate password strength
        if len(new_password) < 8:
            return Response(
                {"success": False, "message": "Password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the token
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"success": False, "message": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if already used
        if reset_token.used:
            return Response(
                {"success": False, "message": "This reset link has already been used."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if expired
        if reset_token.is_expired():
            return Response(
                {"success": False, "message": "Reset link has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update password in Auth0
        try:
            Auth0Client.update_user_password(
                auth0_user_id=reset_token.auth0_user_id,
                new_password=new_password,
            )
            
            # Mark token as used
            reset_token.mark_as_used()
            
            logger.info(f"Password reset successful for: {reset_token.email}")
            
            return Response(
                {"success": True, "message": "Password reset successful! You can now log in with your new password."},
                status=status.HTTP_200_OK,
            )
        except ExternalServiceError as e:
            logger.error(f"Failed to update password in Auth0: {e}")
            return Response(
                {"success": False, "message": "Failed to reset password. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
