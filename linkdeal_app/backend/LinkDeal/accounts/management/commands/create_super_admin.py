"""
Management command to create the first Super Admin user.
Usage: python manage.py create_super_admin --email admin@example.com --password SecurePass123!

This command:
1. Creates the user in Auth0
2. Assigns the super_admin role in Auth0
3. Creates the AppUser in the local database
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.utils import timezone
from accounts.models import AppUser
from accounts.auth0_client import Auth0Client
from core.exceptions import ExternalServiceError
import logging
import getpass

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Create the first Super Admin user for LinkDeal'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            required=True,
            help='Email address for the super admin'
        )
        parser.add_argument(
            '--password',
            type=str,
            required=False,
            help='Password for the super admin (will be prompted if not provided)'
        )
        parser.add_argument(
            '--full-name',
            type=str,
            default='Super Administrator',
            help='Full name for the super admin (default: Super Administrator)'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options.get('password')
        full_name = options['full_name']

        # Check if user already exists
        if AppUser.objects.filter(email=email).exists():
            raise CommandError(f'User with email {email} already exists in the database.')

        # Prompt for password if not provided
        if not password:
            password = getpass.getpass('Enter password for super admin: ')
            password_confirm = getpass.getpass('Confirm password: ')
            if password != password_confirm:
                raise CommandError('Passwords do not match.')

        # Validate password length
        if len(password) < 8:
            raise CommandError('Password must be at least 8 characters long.')

        self.stdout.write(self.style.WARNING(f'Creating Super Admin: {email}'))

        try:
            # 1) Create user in Auth0
            self.stdout.write('  → Creating user in Auth0...')
            auth0_user = Auth0Client.create_user(
                email=email,
                password=password,
                role='super_admin',
                approval_status='approved',
            )
            auth0_user_id = auth0_user['user_id']
            self.stdout.write(self.style.SUCCESS(f'  ✓ Auth0 user created: {auth0_user_id}'))

            # 1.5) Mark email as verified
            self.stdout.write('  → Marking email as verified in Auth0...')
            try:
                Auth0Client.mark_email_verified(auth0_user_id)
                self.stdout.write(self.style.SUCCESS('  ✓ Email verified'))
            except ExternalServiceError as e:
                self.stdout.write(self.style.WARNING(f'  ⚠ Failed to mark email as verified: {e}'))

            # 2) Assign super_admin role in Auth0
            super_admin_role_id = getattr(settings, 'AUTH0_SUPER_ADMIN_ROLE_ID', None)
            if super_admin_role_id:
                self.stdout.write('  → Assigning super_admin role in Auth0...')
                try:
                    Auth0Client.assign_role(
                        auth0_user_id=auth0_user_id,
                        role_id=super_admin_role_id,
                    )
                    self.stdout.write(self.style.SUCCESS('  ✓ Role assigned'))
                except ExternalServiceError as e:
                    self.stdout.write(self.style.WARNING(f'  ⚠ Failed to assign role: {e}'))
            else:
                self.stdout.write(self.style.WARNING('  ⚠ AUTH0_SUPER_ADMIN_ROLE_ID not configured'))

            # 3) Create AppUser in local database
            self.stdout.write('  → Creating AppUser in database...')
            app_user = AppUser.objects.create(
                auth0_id=auth0_user_id,
                email=email,
                role='super_admin',
                status='active',
            )
            self.stdout.write(self.style.SUCCESS(f'  ✓ AppUser created: {app_user.id}'))

            # Success!
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('=' * 50))
            self.stdout.write(self.style.SUCCESS('🎉 Super Admin created successfully!'))
            self.stdout.write(self.style.SUCCESS('=' * 50))
            self.stdout.write(f'  Email: {email}')
            self.stdout.write(f'  Role: super_admin')
            self.stdout.write(f'  Auth0 ID: {auth0_user_id}')
            self.stdout.write(f'  App User ID: {app_user.id}')
            self.stdout.write('')
            self.stdout.write('You can now:')
            self.stdout.write('  1. Login at http://localhost:3102/login')
            self.stdout.write('  2. Access the Admin Dashboard')
            self.stdout.write('  3. Invite other admins from the Settings page')

        except ExternalServiceError as e:
            raise CommandError(f'Failed to create user in Auth0: {e}')
        except Exception as e:
            logger.exception(f'Unexpected error creating super admin {email}')
            raise CommandError(f'Unexpected error: {e}')
