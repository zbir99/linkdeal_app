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
from accounts.models import AppUser, EmailVerificationToken, PasswordResetToken, MentorProfile, MenteeProfile
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

        response = Response(response_data)
        # Prevent browser caching of user data
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response


class MenteeProfileMeView(APIView):
    """
    GET /auth/mentee/profile/me/
    Returns the authenticated mentee's profile data including profile picture.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        user = request.user
        
        try:
            # Get AppUser from auth0_id
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            
            # Get mentee profile
            mentee_profile = MenteeProfile.objects.get(user=app_user)
            
            # Build profile picture URL
            profile_picture_url = None
            if mentee_profile.profile_picture:
                profile_picture_url = request.build_absolute_uri(mentee_profile.profile_picture.url)
            
            response = Response({
                "full_name": mentee_profile.full_name,
                "email": mentee_profile.email,
                "profile_picture": profile_picture_url,
                "social_picture_url": mentee_profile.social_picture_url,
                "country": mentee_profile.country,
                "field_of_study": mentee_profile.field_of_study,
                "languages": mentee_profile.languages,
                "current_role": mentee_profile.current_role,
                "skills": mentee_profile.skills,
                "user_type": mentee_profile.user_type,
                "session_frequency": mentee_profile.session_frequency,
            })
            # Prevent browser caching of profile data
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
        except AppUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except MenteeProfile.DoesNotExist:
            return Response(
                {"error": "Mentee profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request):
        """
        PATCH /auth/mentee/profile/me/
        Updates the authenticated mentee's profile.
        Supports: full_name, bio, language, current_role, profile_picture
        """
        user = request.user
        
        try:
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            mentee_profile = MenteeProfile.objects.get(user=app_user)
            
            # Updateable fields
            if 'full_name' in request.data:
                mentee_profile.full_name = request.data['full_name']
            if 'bio' in request.data:
                # Bio is not a model field, but we can add it or skip
                pass  # Skip for now - add bio field to model if needed
            if 'languages' in request.data:
                mentee_profile.languages = request.data['languages']
            if 'current_role' in request.data:
                mentee_profile.current_role = request.data['current_role']
            if 'skills' in request.data:
                mentee_profile.skills = request.data['skills']
            if 'country' in request.data:
                mentee_profile.country = request.data['country']
            if 'field_of_study' in request.data:
                mentee_profile.field_of_study = request.data['field_of_study']
            
            # Handle profile picture upload
            if 'profile_picture' in request.FILES:
                # Delete old profile picture if exists
                if mentee_profile.profile_picture:
                    mentee_profile.profile_picture.delete(save=False)
                mentee_profile.profile_picture = request.FILES['profile_picture']
            
            mentee_profile.save()
            
            # Build response
            profile_picture_url = None
            if mentee_profile.profile_picture:
                profile_picture_url = request.build_absolute_uri(mentee_profile.profile_picture.url)
            
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "profile": {
                    "full_name": mentee_profile.full_name,
                    "email": mentee_profile.email,
                    "profile_picture": profile_picture_url,
                    "social_picture_url": mentee_profile.social_picture_url,
                    "country": mentee_profile.country,
                    "field_of_study": mentee_profile.field_of_study,
                    "languages": mentee_profile.languages,
                    "current_role": mentee_profile.current_role,
                    "skills": mentee_profile.skills,
                    "user_type": mentee_profile.user_type,
                    "session_frequency": mentee_profile.session_frequency,
                }
            })
        except AppUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except MenteeProfile.DoesNotExist:
            return Response(
                {"error": "Mentee profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class MentorProfileMeView(APIView):
    """
    GET /auth/mentors/profile/me/
    Returns the authenticated mentor's profile data including profile picture.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        user = request.user
        
        try:
            # Get AppUser from auth0_id
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            
            # Get mentor profile
            mentor_profile = MentorProfile.objects.get(user=app_user)
            
            # Build profile picture URL
            profile_picture_url = None
            if mentor_profile.profile_picture:
                profile_picture_url = request.build_absolute_uri(mentor_profile.profile_picture.url)
            
            # Build CV URL
            cv_url = None
            if mentor_profile.cv:
                cv_url = request.build_absolute_uri(mentor_profile.cv.url)
            
            response = Response({
                "full_name": mentor_profile.full_name,
                "email": mentor_profile.email,
                "profile_picture": profile_picture_url,
                "social_picture_url": mentor_profile.social_picture_url,
                "professional_title": mentor_profile.professional_title,
                "location": mentor_profile.location,
                "country": mentor_profile.country,
                "languages": mentor_profile.languages,
                "skills": mentor_profile.skills,
                "bio": mentor_profile.bio,
                "linkedin_url": mentor_profile.linkedin_url,
                "cv_url": cv_url,
                "status": mentor_profile.status,
                "session_rate": str(mentor_profile.session_rate),
                "wallet_balance": str(mentor_profile.wallet_balance or 0),
                "bank_name": mentor_profile.bank_name,
                "iban": mentor_profile.iban,
                "swift_bic": mentor_profile.swift_bic,
            })
            # Prevent browser caching of profile data
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
        except AppUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except MentorProfile.DoesNotExist:
            return Response(
                {"error": "Mentor profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request):
        """Update mentor profile fields."""
        user = request.user
        
        try:
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            mentor_profile = MentorProfile.objects.get(user=app_user)
            
            # Update fields if provided
            if 'full_name' in request.data:
                mentor_profile.full_name = request.data['full_name']
            if 'professional_title' in request.data:
                mentor_profile.professional_title = request.data['professional_title']
            if 'location' in request.data:
                mentor_profile.location = request.data['location']
            if 'linkedin_url' in request.data:
                mentor_profile.linkedin_url = request.data['linkedin_url']
            if 'bio' in request.data:
                mentor_profile.bio = request.data['bio']
            if 'languages' in request.data:
                # Handle languages - can be list or comma-separated string
                languages_data = request.data.getlist('languages') if hasattr(request.data, 'getlist') else request.data.get('languages', [])
                if isinstance(languages_data, str):
                    languages_data = [l.strip() for l in languages_data.split(',') if l.strip()]
                mentor_profile.languages = languages_data
            if 'skills' in request.data:
                # Handle skills - can be list or comma-separated string
                skills_data = request.data.getlist('skills') if hasattr(request.data, 'getlist') else request.data.get('skills', [])
                if isinstance(skills_data, str):
                    skills_data = [s.strip() for s in skills_data.split(',') if s.strip()]
                mentor_profile.skills = skills_data
            
            # Handle profile picture upload
            if 'profile_picture' in request.FILES:
                mentor_profile.profile_picture = request.FILES['profile_picture']
            
            # Handle CV upload
            if 'cv' in request.FILES:
                mentor_profile.cv = request.FILES['cv']
            
            # Handle session rate update
            if 'session_rate' in request.data:
                from decimal import Decimal, InvalidOperation
                try:
                    rate_value = request.data['session_rate']
                    mentor_profile.session_rate = Decimal(str(rate_value))
                except (InvalidOperation, ValueError):
                    return Response(
                        {"error": "Invalid session rate value"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Handle Banking Information update
            if 'bank_name' in request.data:
                mentor_profile.bank_name = request.data['bank_name']
            if 'iban' in request.data:
                mentor_profile.iban = request.data['iban']
            if 'swift_bic' in request.data:
                mentor_profile.swift_bic = request.data['swift_bic']
            
            mentor_profile.save()
            
            # Build profile picture URL for response
            profile_picture_url = None
            if mentor_profile.profile_picture:
                profile_picture_url = request.build_absolute_uri(mentor_profile.profile_picture.url)
            
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "full_name": mentor_profile.full_name,
                "email": mentor_profile.email,
                "profile_picture": profile_picture_url,
                "social_picture_url": mentor_profile.social_picture_url,
                "professional_title": mentor_profile.professional_title,
                "location": mentor_profile.location,
                "country": mentor_profile.country,
                "languages": mentor_profile.languages,
                "skills": mentor_profile.skills,
                "bio": mentor_profile.bio,
                "linkedin_url": mentor_profile.linkedin_url,
                "status": mentor_profile.status,
                "session_rate": str(mentor_profile.session_rate),
                "bank_name": mentor_profile.bank_name,
                "iban": mentor_profile.iban,
                "swift_bic": mentor_profile.swift_bic,
            })
        except AppUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except MentorProfile.DoesNotExist:
            return Response(
                {"error": "Mentor profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Failed to update mentor profile: {e}", exc_info=True)
            return Response(
                {"error": {"type": "ValidationError", "message": str(e)}},
                status=status.HTTP_400_BAD_REQUEST
            )


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
