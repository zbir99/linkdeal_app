# accounts/signals.py
"""
Django signals for account-related operations.
Handles bidirectional sync between Django and Auth0.
"""
import logging
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from accounts.models import AppUser
from accounts.auth0_client import Auth0Client
from core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


@receiver(pre_delete, sender=AppUser)
def delete_appuser_from_auth0(sender, instance, **kwargs):
    """
    Delete the user from Auth0 when AppUser is deleted in Django.
    This ensures bidirectional sync: Django → Auth0.
    
    Uses pre_delete to ensure auth0_id is still available.
    
    Note: This signal is registered in accounts/apps.py to avoid circular imports.
    
    Special handling:
    - If user was already deleted from Auth0 (404), we ignore it (sync scenario)
    - If Auth0 is unavailable, we log but don't fail Django deletion
    """
    if not instance.auth0_id:
        logger.warning(f"AppUser {instance.id} has no auth0_id, skipping Auth0 deletion")
        return
    
    # Check if this deletion is part of a sync operation (user already deleted from Auth0)
    # We can detect this by checking if the deletion context has a flag
    # For now, we'll use ignore_not_found=True to handle 404 gracefully
    try:
        Auth0Client.delete_user(auth0_user_id=instance.auth0_id, ignore_not_found=True)
        logger.info(
            f"Successfully deleted Auth0 user {instance.auth0_id} "
            f"when AppUser {instance.id} ({instance.email}) was deleted"
        )
    except ExternalServiceError as e:
        # Only log error if it's not a 404 (user already deleted)
        error_msg = str(e).lower()
        if "404" not in error_msg and "not found" not in error_msg:
            # Log but don't fail Django deletion if Auth0 deletion fails
            # This ensures Django DB stays consistent even if Auth0 is temporarily unavailable
            logger.error(
                f"Failed to delete Auth0 user {instance.auth0_id} when deleting AppUser {instance.id}: {e}. "
                f"AppUser deletion will proceed, but Auth0 user may still exist."
            )
        else:
            # User already deleted from Auth0 (sync scenario) - this is expected
            logger.info(
                f"Auth0 user {instance.auth0_id} was already deleted from Auth0. "
                f"Proceeding with Django deletion to sync."
            )
    except Exception as e:
        logger.exception(f"Unexpected error deleting Auth0 user {instance.auth0_id}: {e}")

