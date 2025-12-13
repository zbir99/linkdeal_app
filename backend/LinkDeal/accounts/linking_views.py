# accounts/linking_views.py
import logging
from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions

from accounts.models import AppUser, AccountLinkingVerification, MentorProfile, MenteeProfile
from accounts.auth0_client import Auth0Client
from accounts.permissions import IsAuthenticatedAuth0
from core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class CheckEmailView(APIView):
    """
    POST /auth/register/check-email/
    
    Check if an email already exists in the system.
    Used during social registration to determine if account linking is needed.
    """
    permission_classes = [IsAuthenticatedAuth0]  # User must be authenticated via Auth0
    
    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        
        if not email:
            return Response(
                {
                    "success": False,
                    "message": "Email is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if user exists
        existing_user = AppUser.objects.filter(email=email).first()
        exists = existing_user is not None
        
        return Response(
            {
                "success": True,
                "exists": exists,
                "requires_linking": exists,
                "message": "Account with this email already exists." if exists else "Email is available.",
            },
            status=status.HTTP_200_OK,
        )


class RequestLinkingView(APIView):
    """
    POST /auth/register/request-linking/
    
    Request account linking when a user tries to register with social login
    but an account with the same email already exists.
    
    Body:
    {
        "email": "user@example.com",
        "link_consent": true,
        "registration_data": {
            "full_name": "...",
            "field_of_study": "...",  # for mentee
            "country": "...",
            ...
        },
        "role": "mentee" or "mentor"
    }
    """
    permission_classes = [IsAuthenticatedAuth0]
    
    @transaction.atomic
    def post(self, request):
        auth0_user = getattr(request, "user", None)
        
        if not auth0_user or not auth0_user.email or not auth0_user.auth0_id:
            return Response(
                {
                    "success": False,
                    "message": "Authenticated social user must provide email and auth0_id.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        email = request.data.get("email", "").strip().lower()
        link_consent = request.data.get("link_consent", False)
        registration_data = request.data.get("registration_data", {})
        role = request.data.get("role")
        
        # Validate inputs
        if not email:
            return Response(
                {
                    "success": False,
                    "message": "Email is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if not link_consent:
            return Response(
                {
                    "success": False,
                    "message": "Account linking requires explicit consent.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if role not in ["mentor", "mentee"]:
            return Response(
                {
                    "success": False,
                    "message": "Role must be 'mentor' or 'mentee'.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Verify email matches the authenticated user's email
        if email != auth0_user.email.lower():
            return Response(
                {
                    "success": False,
                    "message": "Email does not match authenticated user's email.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Find existing user
        existing_user = AppUser.objects.filter(email=email).first()
        if not existing_user:
            return Response(
                {
                    "success": False,
                    "message": "No existing account found with this email.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Validate that the role matches the existing user's role
        if existing_user.role != role:
            return Response(
                {
                    "success": False,
                    "message": f"Cannot link accounts: existing account is a {existing_user.role}, but you are trying to register as a {role}. Please register with the same role.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if user is banned
        if existing_user.role == "mentor":
            try:
                mentor_profile = existing_user.mentor_profile
                if mentor_profile.status == "banned":
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: this account has been banned.",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except MentorProfile.DoesNotExist:
                pass  # Profile might not exist yet, allow linking

        elif existing_user.role == "mentee":
            try:
                mentee_profile = existing_user.mentee_profile
                if mentee_profile.status == "banned":
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: this account has been banned.",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except MenteeProfile.DoesNotExist:
                pass  # Profile might not exist yet, allow linking

        # Check if email is verified (for DB identities only)
        is_db_identity = existing_user.auth0_id.startswith("auth0|")
        if is_db_identity:
            try:
                auth0_user_data = Auth0Client.get_user(existing_user.auth0_id)
                # Check email_verified from user object or identities
                email_verified = auth0_user_data.get("email_verified", False)
                
                # Also check identities if email_verified not directly on user
                if not email_verified:
                    identities = auth0_user_data.get("identities", [])
                    for identity in identities:
                        if identity.get("provider") == "auth0":
                            email_verified = identity.get("profileData", {}).get("email_verified", False)
                            break
                
                if not email_verified:
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: the existing account's email is not verified. Please verify your email first.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ExternalServiceError as e:
                logger.error(f"Failed to check email verification for {existing_user.auth0_id}: {e}")
                # If we can't check, reject for safety
                return Response(
                    {
                        "success": False,
                        "message": "Cannot verify account status. Please contact support.",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        
        # Check if auth0_id already matches (already linked)
        if existing_user.auth0_id == auth0_user.auth0_id:
            return Response(
                {
                    "success": False,
                    "message": "This account is already linked to your social account.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check for existing pending verification
        existing_verification = AccountLinkingVerification.objects.filter(
            existing_user=existing_user,
            new_auth0_id=auth0_user.auth0_id,
            verified=False,
            expired=False,
        ).first()
        
        if existing_verification:
            if existing_verification.is_expired():
                existing_verification.mark_as_expired()
            else:
                # Return existing verification info
                return Response(
                    {
                        "success": True,
                        "message": "A verification email has already been sent. Please check your email.",
                        "expires_at": existing_verification.expires_at.isoformat(),
                    },
                    status=status.HTTP_200_OK,
                )
        
        # Create new verification record
        verification = AccountLinkingVerification.objects.create(
            existing_user=existing_user,
            new_auth0_id=auth0_user.auth0_id,
            new_email=email,
            registration_data=registration_data,
            role=role,
        )
        
        # Send verification email
        try:
            send_account_linking_email(verification)
            logger.info(
                f"Sent account linking verification email to {email} "
                f"(verification_id: {verification.id})"
            )
        except Exception as e:
            logger.error(f"Failed to send account linking email to {email}: {e}")
            verification.delete()  # Clean up if email fails
            return Response(
                {
                    "success": False,
                    "message": "Failed to send verification email. Please try again.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        return Response(
            {
                "success": True,
                "message": "A verification email has been sent to your email address. Please check your inbox and click the link to complete account linking.",
                "expires_at": verification.expires_at.isoformat(),
                "expires_in_minutes": 15,
            },
            status=status.HTTP_200_OK,
        )


class VerifyLinkingView(APIView):
    """
    GET /auth/register/verify-linking/<token>/
    
    Verify the account linking token and complete the linking process.
    This endpoint is called when the user clicks the link in the verification email.
    """
    permission_classes = []  # Public endpoint (accessed via email link)
    
    @transaction.atomic
    def get(self, request, token):
        try:
            verification = AccountLinkingVerification.objects.get(token=token)
        except AccountLinkingVerification.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Invalid verification token.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Check if already verified
        if verification.verified:
            return Response(
                {
                    "success": False,
                    "message": "This verification link has already been used.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if expired (don't mark as verified yet - only after successful linking)
        if verification.is_expired():
            verification.mark_as_expired()
            return Response(
                {
                    "success": False,
                    "message": "This verification link has expired. Please request a new one.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Link the accounts
        existing_user = verification.existing_user
        existing_auth0_id = existing_user.auth0_id  # e.g., "auth0|db123"
        new_auth0_id = verification.new_auth0_id    # e.g., "google-oauth2|g123"
        
        # Validate that the role matches the existing user's role (BEFORE linking)
        if existing_user.role != verification.role:
            logger.error(
                f"Role mismatch during account linking: existing user {existing_user.email} "
                f"has role '{existing_user.role}' but verification role is '{verification.role}'"
            )
            return Response(
                {
                    "success": False,
                    "message": f"Cannot link accounts: role mismatch. Existing account is a {existing_user.role}, but registration is for a {verification.role}.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if user is banned
        if existing_user.role == "mentor":
            try:
                mentor_profile = existing_user.mentor_profile
                if mentor_profile.status == "banned":
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: this account has been banned.",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except MentorProfile.DoesNotExist:
                pass  # Profile might not exist yet, allow linking

        elif existing_user.role == "mentee":
            try:
                mentee_profile = existing_user.mentee_profile
                if mentee_profile.status == "banned":
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: this account has been banned.",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except MenteeProfile.DoesNotExist:
                pass  # Profile might not exist yet, allow linking

        # Check if email is verified (for DB identities only)
        is_db_identity = existing_auth0_id.startswith("auth0|")
        if is_db_identity:
            try:
                auth0_user_data = Auth0Client.get_user(existing_auth0_id)
                # Check email_verified from user object or identities
                email_verified = auth0_user_data.get("email_verified", False)
                
                # Also check identities if email_verified not directly on user
                if not email_verified:
                    identities = auth0_user_data.get("identities", [])
                    for identity in identities:
                        if identity.get("provider") == "auth0":
                            email_verified = identity.get("profileData", {}).get("email_verified", False)
                            break
                
                if not email_verified:
                    return Response(
                        {
                            "success": False,
                            "message": "Cannot link accounts: the existing account's email is not verified. Please verify your email first.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ExternalServiceError as e:
                logger.error(f"Failed to check email verification for {existing_auth0_id}: {e}")
                # If we can't check, reject for safety
                return Response(
                    {
                        "success": False,
                        "message": "Cannot verify account status. Please contact support.",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        
        # IMPORTANT: Link identities in Auth0 (after all validations pass)
        try:
            Auth0Client.link_identities(
                primary_user_id=existing_auth0_id,   # Keep DB as primary
                secondary_user_id=new_auth0_id        # Link Google to it
            )
            logger.info(
                f"Linked Auth0 identities: {new_auth0_id} -> {existing_auth0_id}"
            )
        except ExternalServiceError as e:
            logger.error(f"Failed to link Auth0 identities: {e}")
            return Response(
                {
                    "success": False,
                    "message": "Failed to link accounts. Please contact support.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        # After Auth0 linking succeeds, mark verification as verified
        # This must happen AFTER successful linking to prevent marking as verified if linking fails
        if not verification.verify():
            # This should not happen since we already checked expired/verified above
            # But if it does, log and continue (linking already succeeded)
            logger.warning(
                f"Verification.verify() returned False after successful Auth0 linking "
                f"for {existing_user.email} (token: {verification.token})"
            )
        
        # After Auth0 linking, both identities share the same user_id
        # So we keep the existing auth0_id (no need to update it)
        # existing_user.auth0_id stays as "auth0|db123"
        
        # Update Auth0 app_metadata (preserve existing role, don't change it)
        try:
            metadata = {
                "role": existing_user.role,  # Use existing role, not verification.role
            }
            if existing_user.role == "mentee":
                metadata["approval_status"] = "approved"
            elif existing_user.role == "mentor":
                # Don't change approval_status if mentor is already approved
                try:
                    mentor_profile = existing_user.mentor_profile
                    if mentor_profile.status == "pending":
                        metadata["approval_status"] = "pending"
                    # If already approved/rejected/banned, don't change it
                except MentorProfile.DoesNotExist:
                    metadata["approval_status"] = "pending"
            
            Auth0Client.update_user_app_metadata(
                auth0_user_id=existing_auth0_id,
                metadata=metadata,
            )
        except ExternalServiceError as e:
            logger.error(f"Failed to update Auth0 metadata during linking: {e}")
            # Continue anyway - linking is still valid
        
        # Assign RBAC role in Auth0 (use existing role)
        from django.conf import settings
        role_id = None
        if existing_user.role == "mentee":
            role_id = getattr(settings, "AUTH0_MENTEE_ROLE_ID", None)
        elif existing_user.role == "mentor":
            role_id = getattr(settings, "AUTH0_MENTOR_ROLE_ID", None)
        
        if role_id:
            try:
                Auth0Client.assign_role(
                    auth0_user_id=existing_auth0_id,
                    role_id=role_id,
                )
            except ExternalServiceError:
                logger.warning(f"Failed to assign RBAC role during linking for {existing_auth0_id}")
        
        # Create or update profile with registration data
        registration_data = verification.registration_data
        
        # Use existing_user.role instead of verification.role
        if existing_user.role == "mentee":
            profile, created = MenteeProfile.objects.get_or_create(
                user=existing_user,
                defaults={
                    "full_name": registration_data.get("full_name", ""),
                    "email": existing_user.email,
                    "field_of_study": registration_data.get("field_of_study", ""),
                    "country": registration_data.get("country", ""),
                    "profile_picture": None,  # Handle file upload separately if needed
                    # NEW FIELDS
                    "interests": registration_data.get("interests", []),
                    "user_type": registration_data.get("user_type"),
                    "session_frequency": registration_data.get("session_frequency"),
                }
            )
            if not created:
                # Update existing profile
                profile.full_name = registration_data.get("full_name", profile.full_name)
                profile.field_of_study = registration_data.get("field_of_study", profile.field_of_study)
                profile.country = registration_data.get("country", profile.country)
                # NEW FIELDS
                profile.interests = registration_data.get("interests", profile.interests)
                profile.user_type = registration_data.get("user_type", profile.user_type)
                profile.session_frequency = registration_data.get("session_frequency", profile.session_frequency)
                profile.save()
        
        elif existing_user.role == "mentor":
            profile, created = MentorProfile.objects.get_or_create(
                user=existing_user,
                defaults={
                    "email": existing_user.email,
                    "full_name": registration_data.get("full_name", ""),
                    "professional_title": registration_data.get("professional_title", ""),
                    "location": registration_data.get("location", ""),
                    "linkedin_url": registration_data.get("linkedin_url", ""),
                    "bio": registration_data.get("bio", ""),
                    "languages": registration_data.get("languages", ""),
                    "country": registration_data.get("country", ""),
                    "status": "pending",
                }
            )
            if not created:
                # Update existing profile (but preserve status if already approved/banned/rejected)
                profile.full_name = registration_data.get("full_name", profile.full_name)
                profile.professional_title = registration_data.get("professional_title", profile.professional_title)
                profile.location = registration_data.get("location", profile.location)
                profile.linkedin_url = registration_data.get("linkedin_url", profile.linkedin_url)
                profile.bio = registration_data.get("bio", profile.bio)
                profile.languages = registration_data.get("languages", profile.languages)
                profile.country = registration_data.get("country", profile.country)
                # Don't override status if already approved/banned/rejected
                if profile.status == "pending":
                    profile.status = "pending"
                profile.save()
        
        logger.info(
            f"Successfully linked account: {existing_user.email} "
            f"(auth0_id: {existing_auth0_id}, role: {existing_user.role})"
        )
        
        return Response(
            {
                "success": True,
                "message": "Account linking completed successfully! You can now log in with your social account.",
            },
            status=status.HTTP_200_OK,
        )


def send_account_linking_email(verification: AccountLinkingVerification):
    """
    Send account linking verification email to the existing user.
    Uses Django's email backend (configured with SendGrid SMTP via Auth0).
    """
    from django.conf import settings
    from django.core.mail import send_mail
    
    # Build verification URL
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    verification_url = f"{frontend_url}/auth/verify-linking/{verification.token}"
    
    recipient_email = verification.existing_user.email
    subject = "Link Your Social Account to LinkDeal"
    
    # Plain text message
    message = f"""Hello,

Someone is trying to link a social account (Google/LinkedIn) to your existing LinkDeal account.

If this was you, please click the link below to verify and complete the account linking:

{verification_url}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

Best regards,
LinkDeal Team
"""
    
    # HTML message (optional, but recommended for better user experience)
    html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Link Your Social Account</h2>
        <p>Hello,</p>
        <p>Someone is trying to link a social account (Google/LinkedIn) to your existing LinkDeal account.</p>
        <p>If this was you, please click the button below to verify and complete the account linking:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Account Linking</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 12px;">{verification_url}</p>
        <p><strong style="color: #d32f2f;">This link will expire in 15 minutes.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>
"""
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Successfully sent account linking email to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send account linking email to {recipient_email}: {e}", exc_info=True)
        raise