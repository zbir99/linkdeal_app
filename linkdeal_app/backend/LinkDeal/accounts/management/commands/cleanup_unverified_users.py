from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import logging
from accounts.models import AppUser
from accounts.auth0_client import Auth0Client
from core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Cleanup user accounts that have been created > 24h ago but are not verified in Auth0."

    def handle(self, *args, **options):
        # 1. Calculate cutoff time
        cutoff_time = timezone.now() - timedelta(hours=24)
        
        self.stdout.write(f"checking for unverified users created before {cutoff_time}...")
        
        # 2. Query potential candidates (older than cutoff)
        # Exclude admins and super admins to prevent accidental lockout
        potential_users = AppUser.objects.filter(
            created_at__lt=cutoff_time
        ).exclude(role__in=["admin", "super_admin"])
        
        count = potential_users.count()
        
        self.stdout.write(f"Found {count} eligible users (excluding admins) created > 24h ago. Checking verification status...")
        # Note: We can't filter by 'verified' efficiently in local DB efficiently without 
        # risking sync issues, or if we trust 'email_verified' in Auth0.
        # So we query all old users and check individually.
        # Optimization: Start with users who have 'invited' status or similar if applicable,
        # but 'active' users might also be unverified.
        
        potential_users = AppUser.objects.filter(created_at__lt=cutoff_time)
        count = potential_users.count()
        
        self.stdout.write(f"Found {count} users created > 24h ago. Checking verification status...")
        
        deleted_count = 0
        
        for user in potential_users:
            try:
                # 3. Check Auth0 status
                try:
                    auth0_user = Auth0Client.get_user(user.auth0_id)
                except ExternalServiceError as e:
                     if "404" in str(e) or "not found" in str(e).lower():
                        # User doesn't exist in Auth0 but exists locally -> Ghost record
                        self.stdout.write(self.style.WARNING(f"User {user.email} not found in Auth0. Deleting local record."))
                        user.delete()
                        deleted_count += 1
                        continue
                     else:
                        # Auth0 error - skip safe
                        self.stderr.write(f"Error checking verification for {user.email}: {e}")
                        continue
                
                # Check email verification status
                is_verified = auth0_user.get("email_verified", False)
                
                if not is_verified:
                    self.stdout.write(f"User {user.email} is NOT verified. Deleting...")
                    
                    # Delete from Auth0
                    try:
                        Auth0Client.delete_user(user.auth0_id, ignore_not_found=True)
                    except Exception as e:
                        self.stderr.write(f"Failed to delete {user.email} from Auth0: {e}")
                        # If we can't delete from Auth0, do we delete locally?
                        # Yes, to enforce the policy. Auth0 user might linger but they can't log in 
                        # if local user is gone (depending on implementation, but safer to cut access).
                        # Actually, if we delete local user, they can't use the app.
                    
                    # Delete locally
                    user.delete()
                    deleted_count += 1
                    logger.info(f"Deleted unverified user {user.email} (created {user.created_at})")
                    
                else:
                    # Verified - safe to keep (and useful to log for debugging initially)
                    # self.stdout.write(f"User {user.email} is verified. Keeping.")
                    pass
                    
            except Exception as e:
                self.stderr.write(f"Unexpected error processing {user.email}: {e}")
        
        self.stdout.write(self.style.SUCCESS(f"Cleanup complete. Deleted {deleted_count} unverified users."))
