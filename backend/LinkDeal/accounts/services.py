# accounts/services.py
"""
Enterprise-grade identity mapping service for Auth0 → AppUser.
Implements the 3-step mapping logic: auth0_id → verified email → auto-create.
"""
import logging
from typing import Optional, Tuple, TYPE_CHECKING
from django.db import transaction
from django.conf import settings
from accounts.models import AppUser

if TYPE_CHECKING:
    from core.authentication import Auth0User

logger = logging.getLogger(__name__)


class IdentityMappingService:
    """
    Central service for mapping Auth0 identities to AppUser instances.
    
    Rules:
    1. Find by auth0_id (exact match)
    2. Find by verified email (identity linking)
    3. Auto-create if truly new
    """

    @staticmethod
    def extract_email_verified(payload: dict) -> bool:
        """
        Extract email_verified status from token payload.
        Checks multiple possible locations.
        """
        ns = getattr(settings, "AUTH0_CUSTOM_NAMESPACE", "https://linkdeal.com/claims/")
        
        # Standard claim
        if "email_verified" in payload:
            return payload["email_verified"]
        
        # Namespaced claim
        if f"{ns}email_verified" in payload:
            return payload[f"{ns}email_verified"]
        
        # From app_metadata
        app_metadata = payload.get(f"{ns}app_metadata", {}) or payload.get("app_metadata", {}) or {}
        if "email_verified" in app_metadata:
            return app_metadata["email_verified"]
        
        # Default: assume verified for social logins (Google/LinkedIn verify emails)
        # For database connections, Auth0 sets email_verified explicitly
        return True

    @classmethod
    @transaction.atomic
    def map_identity_to_app_user(
        cls,
        auth0_user: "Auth0User",
        chosen_role: Optional[str] = None,
    ) -> Tuple[AppUser, bool]:
        """
        Map an Auth0 identity to an AppUser using the 3-step logic.
        
        :param auth0_user: Auth0User instance from token
        :param chosen_role: Role chosen by user during registration ("mentor" or "mentee")
        :return: Tuple of (AppUser instance, was_created: bool)
        """
        auth0_id = auth0_user.auth0_id
        email = auth0_user.email
        
        if not auth0_id:
            raise ValueError("auth0_id is required for identity mapping")
        
        # Extract email_verified from payload
        email_verified = cls.extract_email_verified(auth0_user._payload)
        
        # ============================================================
        # STEP 1: Find by auth0_id (exact match)
        # ============================================================
        try:
            app_user = AppUser.objects.get(auth0_id=auth0_id)
            logger.info(f"Found AppUser by auth0_id: {auth0_id} (email: {app_user.email})")
            return app_user, False
        except AppUser.DoesNotExist:
            pass
        
        # ============================================================
        # STEP 2: Find by verified email (identity linking)
        # ============================================================
        if email and email_verified:
            try:
                existing_user = AppUser.objects.get(email=email)
                # Link this auth0_id to the existing AppUser
                # Update auth0_id if it's different (same human, new identity)
                if existing_user.auth0_id != auth0_id:
                    # Security check: If existing AppUser has a DB identity (auth0|),
                    # verify that the DB identity is verified before allowing social linking
                    is_social_identity = not auth0_id.startswith("auth0|")
                    existing_is_db = existing_user.auth0_id and existing_user.auth0_id.startswith("auth0|")
                    
                    if is_social_identity and existing_is_db:
                        # Import locally to avoid circular dependency
                        from accounts.auth0_client import Auth0Client
                        from core.exceptions import ExternalServiceError
                        
                        try:
                            unverified_db_auth0_id = Auth0Client.get_unverified_db_identity(email=email)
                            if unverified_db_auth0_id == existing_user.auth0_id:
                                logger.warning(
                                    f"Blocked social identity {auth0_id} from linking to "
                                    f"unverified DB account {existing_user.auth0_id} (email: {email})"
                                )
                                from rest_framework.exceptions import AuthenticationFailed
                                raise AuthenticationFailed(
                                    "Un compte base de données non vérifié existe pour cet email. "
                                    "Veuillez vérifier votre email avant de lier ce compte social."
                                )
                        except ExternalServiceError:
                            # If Auth0 check fails, log but allow linking (fail open for availability)
                            logger.warning(
                                f"Failed to verify DB identity status for {email}, "
                                f"allowing social linking to proceed"
                            )
                    
                    logger.info(
                        f"Linking new identity {auth0_id} to existing AppUser {existing_user.id} "
                        f"(email: {email})"
                    )
                    # Update auth0_id to the new one (latest identity wins)
                    existing_user.auth0_id = auth0_id
                    existing_user.save(update_fields=["auth0_id"])
                return existing_user, False
            except AppUser.DoesNotExist:
                pass
            except AppUser.MultipleObjectsReturned:
                # Edge case: multiple users with same email (shouldn't happen with unique constraint)
                logger.warning(f"Multiple AppUsers found for email {email}, using first one")
                existing_user = AppUser.objects.filter(email=email).first()
                if existing_user.auth0_id != auth0_id:
                    # Security check: If existing AppUser has a DB identity (auth0|),
                    # verify that the DB identity is verified before allowing social linking
                    is_social_identity = not auth0_id.startswith("auth0|")
                    existing_is_db = existing_user.auth0_id and existing_user.auth0_id.startswith("auth0|")
                    
                    if is_social_identity and existing_is_db:
                        # Import locally to avoid circular dependency
                        from accounts.auth0_client import Auth0Client
                        from core.exceptions import ExternalServiceError
                        
                        try:
                            unverified_db_auth0_id = Auth0Client.get_unverified_db_identity(email=email)
                            if unverified_db_auth0_id == existing_user.auth0_id:
                                logger.warning(
                                    f"Blocked social identity {auth0_id} from linking to "
                                    f"unverified DB account {existing_user.auth0_id} (email: {email})"
                                )
                                from rest_framework.exceptions import AuthenticationFailed
                                raise AuthenticationFailed(
                                    "Un compte base de données non vérifié existe pour cet email. "
                                    "Veuillez vérifier votre email avant de lier ce compte social."
                                )
                        except ExternalServiceError:
                            # If Auth0 check fails, log but allow linking (fail open for availability)
                            logger.warning(
                                f"Failed to verify DB identity status for {email}, "
                                f"allowing social linking to proceed"
                            )
                    
                    existing_user.auth0_id = auth0_id
                    existing_user.save(update_fields=["auth0_id"])
                return existing_user, False
        
        # ============================================================
        # STEP 3: Auto-create AppUser (first time ever in LinkDeal)
        # ============================================================
        if not email:
            raise ValueError("Email is required to create a new AppUser")
        
        # Determine role: use chosen_role if provided, otherwise try to infer from token
        role = chosen_role
        if not role:
            # Try to get from token
            role = auth0_user.role or auth0_user.app_metadata.get("role")
        
        # Validate role
        valid_roles = ["super_admin", "admin", "mentor", "mentee"]
        if role not in valid_roles:
            # Default to mentee if unclear
            logger.warning(f"Invalid or missing role '{role}', defaulting to 'mentee'")
            role = "mentee"
        
        app_user = AppUser.objects.create(
            auth0_id=auth0_id,
            email=email,
            role=role,
            status="active",
        )
        
        logger.info(
            f"Auto-created AppUser for {email} (auth0_id: {auth0_id}, role: {role})"
        )
        
        return app_user, True

