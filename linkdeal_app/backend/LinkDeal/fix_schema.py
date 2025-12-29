import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

def nuke_tables():
    # Order matters for dependencies, but CASCADE handles most
    tables_to_drop = [
        # Billing
        'billing_payment',
        
        # Mentoring
        'mentoring_review',
        'mentoring_mentorcategoryassignment',
        'mentoring_mentormenteerelation',
        'mentoring_mentorcategory', 
        'mentoring_mentorfavorite',
        
        # Scheduling
        'scheduling_sessionattachment',
        'scheduling_session',
        'scheduling_mentoravailability',
        'scheduling_sessiontype',
        
        # Accounts
        'accounts_emailverificationtoken',
        'accounts_passwordresettoken',
        'accounts_accountlinkingverification',
        'accounts_menteeprofile',
        'accounts_mentorprofile',
        'accounts_appuser', # Core user model
        'accounts_language',
    ]

    with connection.cursor() as cursor:
        for table in tables_to_drop:
            try:
                # Use CASCADE to remove dependencies
                cursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')
                print(f"Successfully dropped table: {table}")
            except Exception as e:
                print(f"Error dropping table {table}: {str(e)}")

        # Also clear migration history for these apps to ensure clean state
        try:
             cursor.execute("DELETE FROM django_migrations WHERE app IN ('accounts', 'billing', 'scheduling', 'mentoring');")
             print("Cleared migration history for apps.")
        except Exception as e:
             print(f"Error clearing migrations: {str(e)}")

if __name__ == '__main__':
    nuke_tables()
