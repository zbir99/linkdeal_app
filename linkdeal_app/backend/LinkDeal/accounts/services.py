# accounts/services.py
"""
Identity mapping service for Auth0 → AppUser.
Finds AppUser by auth0_id. No auto-creation - AppUser must be created explicitly during registration.
"""
import logging
from typing import Optional, TYPE_CHECKING
from django.db import transaction
from django.conf import settings
from accounts.models import AppUser

if TYPE_CHECKING:
    from core.authentication import Auth0User

logger = logging.getLogger(__name__)


class IdentityMappingService:
    """
    Central service for finding AppUser by Auth0 identity.
    
    Rules:
    1. Find by auth0_id (exact match)
    2. Raises ValueError if not found (no auto-creation)
    
    NOTE: AppUser must be created explicitly during registration.
    Account linking must be done explicitly through the registration flow.
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
    def map_identity_to_app_user(
        cls,
        auth0_user: "Auth0User",
        chosen_role: Optional[str] = None,
    ) -> AppUser:
        """
        Find AppUser by auth0_id. Raises ValueError if not found.
        
        NOTE: No auto-creation. AppUser must be created explicitly during registration.
        
        :param auth0_user: Auth0User instance from token
        :param chosen_role: Not used, kept for backward compatibility
        :return: AppUser instance
        :raises ValueError: If AppUser not found
        """
        auth0_id = auth0_user.auth0_id
        
        if not auth0_id:
            raise ValueError("auth0_id is required for identity mapping")
        
        # Find by auth0_id (exact match)
        try:
            app_user = AppUser.objects.get(auth0_id=auth0_id)
            logger.info(f"Found AppUser by auth0_id: {auth0_id} (email: {app_user.email})")
            return app_user
        except AppUser.DoesNotExist:
            raise ValueError(
                f"AppUser not found for auth0_id: {auth0_id}. "
                "Registration is required before login."
            )

