import logging

from rest_framework.throttling import ScopedRateThrottle, AnonRateThrottle
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
from accounts.models import AppUser
from accounts.auth0_client import Auth0Client
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

        return Response({
            "auth0_id": user.auth0_id,
            "email": email,
            # 'role' is the primary/derived role (convenience field for quick access)
            # 'roles' is the full RBAC roles array (can contain multiple roles)
            "role": role,
            "roles": user.roles,
            # 'app_metadata' contains Auth0 metadata including 'role' for backward compatibility
            "app_metadata": app_metadata,
            "permissions": user.permissions,
        })


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
# PASSWORD RESET (AUTH0)
# ---------------------------------------------------------------

class PasswordResetRequestView(APIView):
    """
    POST /auth/password/reset/  (alias: /auth/reset-password/)
    Always returns success message (no email existence leak).
    """
    permission_classes = []  # Public

    def post(self, request):
        email = (request.data.get("email") or "").strip()

        if not email:
            return Response(
                {"success": False, "message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate email format (avoid malformed requests)
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"success": False, "message": "Invalid email format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Default: do not leak existence; always return success
        try:
            # Only attempt reset for DB (auth0) identities.
            # Social-only users (Google/LinkedIn) will bypass this call but still get generic success.
            has_db_identity = False
            try:
                has_db_identity = Auth0Client.user_has_db_identity(email=email)
            except ExternalServiceError as exc:
                # If Auth0 check fails, log and continue with generic success
                logger.warning("Could not verify DB identity for %s: %s", email, exc)

            if has_db_identity:
                try:
                    Auth0Client.send_password_reset_email(email=email)
                except ExternalServiceError as exc:
                    logger.warning("Password reset request failed for %s: %s", email, exc)
                except Exception as exc:
                    logger.warning("Unexpected error during password reset for %s: %s", email, exc)
            else:
                # Social-only users: no reset attempt, but keep response generic
                logger.info("Password reset requested for social-only user (email=%s); skipping Auth0 reset call.", email)

        except Exception as exc:
            # Any unexpected error should not leak details
            logger.warning("Unexpected error during password reset for %s: %s", email, exc)

        return Response(
            {
                "success": True,
                "message": "If an account exists for this email, a password reset link has been sent.",
            },
            status=status.HTTP_200_OK,
        )

