"""
Django management command to clean up Auth0 users that never completed registration.

This command finds Auth0 users (from social logins) that:
- Were created more than X days ago
- Don't have a corresponding AppUser in the local database
- Never completed registration

Usage:
    python manage.py cleanup_auth0_users --days 30
    python manage.py cleanup_auth0_users --days 30 --dry-run
    python manage.py cleanup_auth0_users --days 30 --connection google-oauth2
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.auth0_client import Auth0Client
from accounts.models import AppUser
from core.exceptions import ExternalServiceError
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Clean up Auth0 users that never completed registration'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Delete Auth0 users older than this many days (default: 30)'
        )
        parser.add_argument(
            '--connection',
            type=str,
            default=None,
            help='Filter by connection name (e.g., google-oauth2, linkedin). If not specified, checks all connections.'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )

    def handle(self, *args, **options):
        days = options['days']
        connection = options.get('connection')
        dry_run = options['dry_run']
        
        self.stdout.write(
            self.style.WARNING(
                f"Starting cleanup of Auth0 users older than {days} days"
                + (f" from connection '{connection}'" if connection else "")
                + (" (DRY RUN)" if dry_run else "")
            )
        )
        
        # Calculate cutoff date
        cutoff_date = timezone.now() - timedelta(days=days)
        cutoff_timestamp = int(cutoff_date.timestamp() * 1000)  # Auth0 uses milliseconds
        
        deleted_count = 0
        kept_count = 0
        error_count = 0
        page = 0
        per_page = 100
        
        try:
            while True:
                # Get users from Auth0
                try:
                    result = Auth0Client.list_users(
                        connection=connection,
                        per_page=per_page,
                        page=page,
                        include_totals=True
                    )
                except ExternalServiceError as e:
                    self.stdout.write(
                        self.style.ERROR(f"Failed to list Auth0 users: {e}")
                    )
                    break
                
                users = result.get('users', [])
                total = result.get('total', len(users))
                
                if not users:
                    break
                
                self.stdout.write(f"Processing page {page + 1} ({len(users)} users)...")
                
                for auth0_user in users:
                    auth0_id = auth0_user.get('user_id')
                    created_at = auth0_user.get('created_at')
                    email = auth0_user.get('email', 'unknown')
                    
                    # Parse created_at timestamp (Auth0 format: ISO 8601 or timestamp)
                    try:
                        if isinstance(created_at, str):
                            # Parse ISO 8601 format (e.g., "2024-01-01T00:00:00.000Z")
                            from datetime import datetime
                            # Remove timezone info if present and parse
                            created_str = created_at.replace('Z', '+00:00')
                            if '+' not in created_str and '-' in created_str[-6:]:
                                # Already has timezone
                                pass
                            elif '+' not in created_str:
                                created_str += '+00:00'
                            created_dt = datetime.fromisoformat(created_str.replace('Z', ''))
                            # Convert to UTC timestamp in milliseconds
                            created_timestamp = int(created_dt.timestamp() * 1000)
                        elif isinstance(created_at, (int, float)):
                            # Already a timestamp (in milliseconds or seconds)
                            created_timestamp = int(created_at) if created_at > 1e10 else int(created_at * 1000)
                        else:
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Unknown created_at format for user {auth0_id}, skipping"
                                )
                            )
                            error_count += 1
                            continue
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Could not parse created_at for user {auth0_id}: {e}, skipping"
                            )
                        )
                        error_count += 1
                        continue
                    
                    # Check if user is older than cutoff
                    if created_timestamp >= cutoff_timestamp:
                        # User is too new, skip
                        kept_count += 1
                        continue
                    
                    # Check if we have this user in our database
                    app_user_exists = AppUser.objects.filter(auth0_id=auth0_id).exists()
                    
                    if not app_user_exists:
                        # User never completed registration - candidate for deletion
                        if dry_run:
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Would delete: {auth0_id} ({email}) - created: {created_at}"
                                )
                            )
                            deleted_count += 1
                        else:
                            try:
                                Auth0Client.delete_user(auth0_id, ignore_not_found=True)
                                deleted_count += 1
                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"Deleted: {auth0_id} ({email})"
                                    )
                                )
                                logger.info(f"Deleted unused Auth0 user: {auth0_id} ({email})")
                            except ExternalServiceError as e:
                                self.stdout.write(
                                    self.style.ERROR(
                                        f"Failed to delete {auth0_id}: {e}"
                                    )
                                )
                                error_count += 1
                                logger.error(f"Failed to delete Auth0 user {auth0_id}: {e}")
                    else:
                        # User exists in our database - keep
                        kept_count += 1
                
                # Check if we've processed all users
                if len(users) < per_page:
                    break
                
                page += 1
                
                # Safety limit to prevent infinite loops
                if page > 100:  # Max 10,000 users
                    self.stdout.write(
                        self.style.WARNING("Reached page limit (100), stopping")
                    )
                    break
            
            # Summary
            self.stdout.write("\n" + "=" * 60)
            if dry_run:
                self.stdout.write(
                    self.style.WARNING(
                        f"DRY RUN COMPLETE:\n"
                        f"  Would delete: {deleted_count} users\n"
                        f"  Would keep: {kept_count} users\n"
                        f"  Errors: {error_count}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"CLEANUP COMPLETE:\n"
                        f"  Deleted: {deleted_count} users\n"
                        f"  Kept: {kept_count} users\n"
                        f"  Errors: {error_count}"
                    )
                )
                
        except KeyboardInterrupt:
            self.stdout.write(
                self.style.WARNING("\nCleanup interrupted by user")
            )
        except Exception as e:
            logger.exception("Unexpected error during Auth0 cleanup")
            self.stdout.write(
                self.style.ERROR(f"Unexpected error: {e}")
            )
            raise

