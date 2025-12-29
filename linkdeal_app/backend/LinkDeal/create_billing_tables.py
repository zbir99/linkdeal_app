"""Apply billing migrations by creating tables directly"""
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'LinkDeal.settings'

from django.conf import settings
import psycopg2

db = settings.DATABASES['default']
conn = psycopg2.connect(
    host=db['HOST'],
    port=db['PORT'],
    database=db['NAME'],
    user=db['USER'],
    password=db['PASSWORD']
)
conn.autocommit = True
cur = conn.cursor()

# Check if billing_payment table exists
cur.execute("""
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'billing_payment'
    )
""")
payment_exists = cur.fetchone()[0]
print(f"billing_payment table exists: {payment_exists}")

if not payment_exists:
    print("Creating billing_payment table...")
    cur.execute("""
        CREATE TABLE billing_payment (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            session_id UUID NOT NULL REFERENCES scheduling_session(id) ON DELETE CASCADE,
            mentee_id UUID NOT NULL REFERENCES accounts_menteeprofile(id) ON DELETE CASCADE,
            mentor_id UUID NOT NULL REFERENCES accounts_mentorprofile(id) ON DELETE CASCADE,
            amount DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(3) NOT NULL DEFAULT 'USD',
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            payment_method VARCHAR(50) NOT NULL DEFAULT 'bank_transfer',
            reference VARCHAR(100),
            platform_fee DECIMAL(10, 2) DEFAULT 0,
            mentor_payout DECIMAL(10, 2) DEFAULT 0,
            payout_processed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE
        )
    """)
    print("✓ Created billing_payment table")

# Check if billing_payout table exists
cur.execute("""
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'billing_payout'
    )
""")
payout_exists = cur.fetchone()[0]
print(f"billing_payout table exists: {payout_exists}")

if not payout_exists:
    print("Creating billing_payout table...")
    cur.execute("""
        CREATE TABLE billing_payout (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES accounts_appuser(id) ON DELETE CASCADE,
            amount DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(3) NOT NULL DEFAULT 'USD',
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            bank_name VARCHAR(255),
            iban VARCHAR(100),
            swift_bic VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            processed_at TIMESTAMP WITH TIME ZONE
        )
    """)
    print("✓ Created billing_payout table")

# Mark migrations as applied
from datetime import datetime

migrations_to_fake = [
    '0001_initial',
    '0002_remove_payment_refunded_at_payment_payout_processed_and_more'
]

cur.execute("SELECT name FROM django_migrations WHERE app='billing'")
applied = [row[0] for row in cur.fetchall()]

for migration_name in migrations_to_fake:
    if migration_name not in applied:
        print(f"Marking as applied: {migration_name}")
        cur.execute(
            "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, %s)",
            ('billing', migration_name, datetime.now())
        )

cur.close()
conn.close()
print("\nDone! Billing tables are ready.")
