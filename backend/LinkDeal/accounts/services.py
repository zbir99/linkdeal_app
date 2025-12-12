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
    2. REMOVED - No automatic email-based linking (must be done explicitly during registration)
    3. Auto-create if truly new
    
    NOTE: Email-based linking has been removed. Account linking must
    be done explicitly through the registration flow.
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
        Map an Auth0 identity to an AppUser using the 2-step logic.
        
        NOTE: Email-based linking has been removed. Account linking must
        be done explicitly through the registration flow.
        
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
        # STEP 2: REMOVED - No automatic email-based linking
        # Account linking must be done explicitly during registration
        # ============================================================
        
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

